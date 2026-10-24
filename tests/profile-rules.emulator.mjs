// Run only against a local emulator; never uses your production Firebase project.
import {before, after, test} from 'node:test';
import {readFileSync} from 'node:fs';
import {initializeTestEnvironment, assertSucceeds, assertFails} from '@firebase/rules-unit-testing';
import {doc, setDoc, getDoc, writeBatch} from 'firebase/firestore';
let env;
const profilePost = {userId:'alice',authorId:'alice',type:'photo',mediaUrl:'https://example.com/test.jpg',caption:'Test',stateId:'tx',communityPostId:'profile-alice-p1'};
before(async () => {
  const endpoint = process.env.FIRESTORE_EMULATOR_HOST;
  if (!endpoint) throw new Error('Start the Firestore emulator first.');
  const [host, port] = endpoint.split(':');
  env = await initializeTestEnvironment({projectId:'demo-my-hssportsfamily',firestore:{host,port:Number(port),rules:readFileSync('firestore.rules','utf8')}});
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db,'users/alice'),{isPrivateProfile:false});
    await setDoc(doc(db,'users/private'),{isPrivateProfile:true});
    await setDoc(doc(db,'users/private/posts/p1'),{...profilePost,userId:'private',authorId:'private'});
  });
});
after(async () => {await env?.cleanup();});
test('owner can create and read a profile post; another account cannot write it',async()=>{
  const alice=env.authenticatedContext('alice').firestore();
  await assertSucceeds(setDoc(doc(alice,'users/alice/posts/owned'),profilePost));
  await assertSucceeds(getDoc(doc(alice,'users/alice/posts/owned')));
  const bob=env.authenticatedContext('bob').firestore();
  await assertFails(setDoc(doc(bob,'users/alice/posts/foreign'),{...profilePost,userId:'bob',authorId:'bob'}));
  await assertFails(setDoc(doc(alice,'users/alice/posts/spoofed'),{...profilePost,authorId:'bob'}));
});
test('public reads work; an unrelated account cannot read a private profile post',async()=>{
  await assertSucceeds(getDoc(doc(env.unauthenticatedContext().firestore(),'users/alice/posts/owned')));
  await assertFails(getDoc(doc(env.authenticatedContext('bob').firestore(),'users/private/posts/p1')));
  await assertSucceeds(getDoc(doc(env.authenticatedContext('private').firestore(),'users/private/posts/p1')));
});
test('linked profile/state copies succeed atomically; forged links fail',async()=>{
  const db=env.authenticatedContext('alice').firestore();
  const copy={userId:'alice',authorId:'alice',activityType:'profilePost',profileUserId:'alice',profilePostId:'p1',mediaUrl:profilePost.mediaUrl,message:'Test'};
  const batch=writeBatch(db);batch.set(doc(db,'users/alice/posts/p1'),profilePost);
  batch.set(doc(db,'stateFeeds/tx/posts/profile-alice-p1'),copy);await assertSucceeds(batch.commit());
  await assertFails(setDoc(doc(db,'stateFeeds/fl/posts/forged'),copy));
  await assertFails(setDoc(doc(db,'stateFeeds/tx/posts/wrong-media'),{...copy,mediaUrl:'https://example.com/other.jpg'}));
});
test('private profile cannot create a public automatic community copy',async()=>{
  const db=env.authenticatedContext('private').firestore();
  const batch=writeBatch(db);
  batch.set(doc(db,'users/private/posts/new'),{...profilePost,userId:'private',authorId:'private',communityPostId:'private-new'});
  batch.set(doc(db,'stateFeeds/tx/posts/private-new'),{userId:'private',authorId:'private',activityType:'profilePost',profileUserId:'private',profilePostId:'new',mediaUrl:profilePost.mediaUrl,message:'Test'});
  await assertFails(batch.commit());
});
test('broadcast publish secrets remain unreadable',async()=>{
  const db=env.authenticatedContext('alice').firestore();
  await assertFails(getDoc(doc(db,'broadcastSecrets/test')));
  await assertFails(getDoc(doc(db,'broadcastHosts/alice')));
});
