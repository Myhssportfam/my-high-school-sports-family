# Delete profiles, posts, and stories for every account type

This update includes the prior Delete Profile update and adds individual post/story controls. Every signed-in role can delete its own content; it does not enable deleting another person's account or mass deletion.

## Install

Download `myhssportsfamily-delete-controls-update.zip` to Downloads. In the VS Code terminal, run:

```bash
cd ~/Documents/my-high-school-sports-family
unzip -o ~/Downloads/myhssportsfamily-delete-controls-update.zip -d .
```

Stop your existing server with Control+C in its terminal, then start it again:

```bash
npm run dev -- --port 3007
```

## Where the controls appear

- **Delete profile:** Profile → Home → Delete Profile. Also available through the navigation menu → Account Settings → Delete my profile and account. Account Settings works even when a profile has no state selected.
- **Profile post:** Open one of your photos/videos → Delete post. Removes its matched state community copy in the same database commit.
- **State community post:** Delete post beside your own post. If it is a linked profile post, the matched original is removed from your profile too.
- **Feed post:** Delete post beside your own post.
- **Coach post:** Delete post beside your own post. Coach participation is required to publish, but deletion checks ownership rather than current role.
- **Story:** Open one of your stories → Delete story. All your active stories are accessible. The older homepage story strip also has a Delete story control below your story.

Every delete asks for confirmation. Account deletion additionally requires typing DELETE and current password/Google verification. Canceling leaves content intact.

## Setup and behavior

No Firebase Rules paste is needed. Keep the existing server-only Firebase Admin credentials. The new authenticated `/api/content/delete` route checks ownership using the verified token and allows only known post/story locations. It deletes post/story documents and nested replies/likes. An unexpected cleanup failure is disclosed rather than hidden.

Individual post/story deletion does not remove uploaded files from Storage, because other saved/shared content may use those files. Uploaded copies are cleaned when deleting the whole account under the supported account upload paths. Copies others made and references on other people's content may remain. See `DELETE_PROFILE_SETUP.md` for account deletion scope and server requirements.

Test with disposable accounts: make a profile post and verify its state copy, delete from each location, cancel a delete, delete a story, and verify someone else's content has no Delete option and cannot be deleted through the server route. Do not test account deletion using your main account.
