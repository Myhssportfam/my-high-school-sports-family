interface StateRanking {
  state: string;
  points: number;
  gold: number;
  silver: number;
  bronze: number;
  wins: number;
  losses: number;
}
import { db } from "./firebase";
export const stateRankings: StateRanking[] = [
  { state: "Alabama", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Alaska", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Arizona", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Arkansas", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },

  { state: "California", points: 1840, gold: 8, silver: 12, bronze: 6, wins: 98, losses: 70 },

  { state: "Colorado", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Connecticut", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Delaware", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },

  { state: "Florida", points: 2180, gold: 11, silver: 10, bronze: 7, wins: 119, losses: 61 },

  { state: "Georgia", points: 1960, gold: 9, silver: 9, bronze: 11, wins: 104, losses: 66 },

  { state: "Hawaii", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Idaho", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Illinois", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Indiana", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Iowa", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Kansas", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Kentucky", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Louisiana", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Maine", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Maryland", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Massachusetts", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Michigan", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Minnesota", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Mississippi", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Missouri", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Montana", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Nebraska", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Nevada", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "New Hampshire", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "New Jersey", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "New Mexico", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "New York", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "North Carolina", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "North Dakota", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },

  { state: "Ohio", points: 1725, gold: 7, silver: 9, bronze: 8, wins: 91, losses: 73 },

  { state: "Oklahoma", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Oregon", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Pennsylvania", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Rhode Island", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "South Carolina", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "South Dakota", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Tennessee", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },

  { state: "Texas", points: 2450, gold: 14, silver: 8, bronze: 5, wins: 128, losses: 54 },

  { state: "Utah", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Vermont", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Virginia", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Washington", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "West Virginia", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Wisconsin", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
  { state: "Wyoming", points: 0, gold: 0, silver: 0, bronze: 0, wins: 0, losses: 0 },
];

export const getSortedStateRankings = () => {
  return [...stateRankings].sort((a, b) => b.points - a.points);
};

export const getStateRank = (stateName: string) => {
  const rankings = getSortedStateRankings();

  const index = rankings.findIndex(
    (state) => state.state.toLowerCase() === stateName.toLowerCase()
  );

  if (index === -1) return null;

  return {
    rank: index + 1,
    ...rankings[index],
  };
};

export const awardArenaPlacement = (
  stateName: string,
  placement: number
) => {
  const state = stateRankings.find(
    (item) => item.state.toLowerCase() === stateName.toLowerCase()
  );

  if (!state) return;

  if (placement === 1) {
    state.points += 100;
    state.gold += 1;
  }

  if (placement === 2) {
    state.points += 70;
    state.silver += 1;
  }

  if (placement === 3) {
    state.points += 50;
    state.bronze += 1;
  }

  if (placement === 4) {
    state.points += 35;
  }

  if (placement === 5) {
    state.points += 25;
  }
};

export const awardArenaWin = (stateName: string) => {
  const state = stateRankings.find(
    (item) => item.state.toLowerCase() === stateName.toLowerCase()
  );

  if (!state) return;

  state.points += 10;
  state.wins += 1;
};

export const awardArenaLoss = (stateName: string) => {
  const state = stateRankings.find(
    (item) => item.state.toLowerCase() === stateName.toLowerCase()
  );

  if (!state) return;

  state.losses += 1;
};
import {
  doc,
  getDoc,
  setDoc,
  increment,
} from "firebase/firestore";


export async function updateStateArenaRecord(
  winnerState: string,
  loserState: string
) {
  if (!winnerState || !loserState) return;

  const winnerId = winnerState.toLowerCase().replace(/\s+/g, "-");
  const loserId = loserState.toLowerCase().replace(/\s+/g, "-");
  const winnerRef = doc(db, "stateRankings", winnerId);
  const loserRef = doc(db, "stateRankings", loserId);

  const winnerSnap = await getDoc(winnerRef);
  const loserSnap = await getDoc(loserRef);

  if (!winnerSnap.exists()) {
    await setDoc(winnerRef, {
      state: winnerState,
      wins: 1,
      losses: 0,
      gamesPlayed: 1,
    });
  } else {
    await setDoc(
      winnerRef,
      {
        wins: increment(1),
        gamesPlayed: increment(1),
      },
      { merge: true }
    );
  }

  if (!loserSnap.exists()) {
    await setDoc(loserRef, {
      state: loserState,
      wins: 0,
      losses: 1,
      gamesPlayed: 1,
    });
  } else {
    await setDoc(
      loserRef,
      {
        losses: increment(1),
        gamesPlayed: increment(1),
      },
      { merge: true }
    );
  }
}
export const getRankedStates = () => {
  return [...stateRankings]
    .sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      if (a.losses !== b.losses) {
        return a.losses - b.losses;
      }

      return b.points - a.points;
    })
    .map((state, index) => ({
      ...state,
      rank: index + 1,
    }));
};