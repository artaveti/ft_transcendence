import { BASE_URL } from '../index.js';
import { updateTextForElem } from '../utils/languages.js';
import { formatDate, formatSeconds } from '../utils/date.js';
import { isUserConnected } from "../utils/utils.js";
import { navigateTo } from '../index.js';
import { authFetch } from '../utils/authFetch.js';

// Type definition for the response data
interface PongStats {
    total_pong_matches: number;
    total_pong_time: number;
}

interface PvPStats {
    match_date: string;
    player_one: string;
    player_two: string;
    match_score: string;
    winner: string;
    match_duration: string;
}

interface AiStats {
    match_date: string;
    player_one: string;
    ai_level: string;
    match_score: string;
    winner: string;
    match_duration: string;
}

interface TournamentStats {
    date: string;
    player_one: string;
    player_two: string;
    player_three: string;
    player_four: string;
    winner: string;
    duration: string;
}

// Function that will be called when the view is loaded
export async function pongStatistics(): Promise<void> {
    if (!(await isUserConnected())) {
        navigateTo('/signin');
        return;
    }

    const pvpBtn = document.getElementById('pvp-stat-btn') as HTMLButtonElement;
    const aiBtn = document.getElementById('ai-stat-btn') as HTMLButtonElement;
    const tournamentBtn = document.getElementById('tournament-stat-btn') as HTMLButtonElement;

    const statTable = document.getElementById('pong-stat-table') as HTMLTableElement;
    const globalStatTable = document.getElementById('pong-global-stat-table') as HTMLTableElement;

    // Fill global stats table
    const fillGlobalStatTable = (): void => {
        globalStatTable.innerHTML = '';

        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const columns = ['total games', 'total duration'];
        columns.forEach(column => {
            const th = document.createElement('th');
            th.setAttribute('data-translate', column);
            tr.appendChild(th);
            updateTextForElem(th, column);
        });
        thead.appendChild(tr);
        globalStatTable.append(thead);

        const tbody = document.createElement('tbody');
        globalStatTable.appendChild(tbody);

        const fillGlobalStats = async (): Promise<void> => {
            const response = await authFetch(`${BASE_URL}/api/pong_stats`);
            if (response.status === 200) {
                const responseData: PongStats = await response.json();
                const tr = document.createElement('tr');
                const columns = ['total_pong_matches', 'total_pong_time'];
               const td1 = document.createElement('td');
                td1.textContent = String(responseData.total_pong_matches);
                tr.appendChild(td1);

                const td2 = document.createElement('td');
                td2.textContent = formatSeconds(responseData.total_pong_time);
                tr.appendChild(td2);

                tbody.appendChild(tr);
            }
        };

        fillGlobalStats();
    };

    // Fill PvP stats table
    const fillPvpTable = (): void => {
        statTable.innerHTML = '';

        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const columns = ['db date', 'db player 1', 'db player 2', 'db score', 'db winner', 'db duration'];
        columns.forEach(column => {
            const th = document.createElement('th');
            th.setAttribute('data-translate', column);
            tr.appendChild(th);
            updateTextForElem(th, column);
        });
        thead.appendChild(tr);
        statTable.appendChild(thead);

        const tbody = document.createElement('tbody');
        statTable.appendChild(tbody);

        const fillPvpStats = async (): Promise<void> => {
            const response = await authFetch(`${BASE_URL}/api/PvPong_match_history`);
            if (response.status === 200) {
                const stats: PvPStats[] = await response.json();
                stats.forEach(stat => {
                    const tr = document.createElement('tr');
                    const columns = ['match_date', 'player_one', 'player_two', 'match_score', 'winner', 'match_duration'];
                    // columns.forEach(column => {
                    //     const td = document.createElement('td');
                    //     td.textContent = column === 'match_date' ? formatDate(stat[column]) : stat[column];
                    //     tr.appendChild(td);
                    // });
					const td1 = document.createElement('td');
td1.textContent = formatDate(stat.match_date);
tr.appendChild(td1);

const td2 = document.createElement('td');
td2.textContent = stat.player_one;
tr.appendChild(td2);

const td3 = document.createElement('td');
td3.textContent = stat.player_two;
tr.appendChild(td3);

const td4 = document.createElement('td');
td4.textContent = stat.match_score;
tr.appendChild(td4);

const td5 = document.createElement('td');
td5.textContent = stat.winner;
tr.appendChild(td5);

const td6 = document.createElement('td');
td6.textContent = stat.match_duration;
tr.appendChild(td6);

                    tbody.appendChild(tr);
                });
            }
        };

        fillPvpStats();
    };

	// Fill table with AI stats
// Function to fill the table
const fillAiTable = (): void => {
  // Clear the table
  statTable.innerHTML = '';

  // Create the table headers
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  const columns = ['db date', 'db player', 'db ai lvl', 'db score', 'db winner', 'db duration'];

  columns.forEach((column: string) => {
    const th = document.createElement('th');
    th.setAttribute('data-translate', column);
    tr.appendChild(th);
    updateTextForElem(th, column);
  });

  thead.appendChild(tr);
  statTable.appendChild(thead);

  // Create the table body
  const tbody = document.createElement('tbody');
  statTable.appendChild(tbody);

  // Get the AI stats and add them to the table
  const fillAiStats = async (): Promise<void> => {
    const response = await authFetch(`${BASE_URL}/api/AIpong_match_history`);
    if (response.status === 200) {
      const stats: AiStats[] = await response.json();

      // If there are no stats
      if (stats.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '6');
        td.setAttribute('data-translate', 'no stats');
        updateTextForElem(td, 'no stats');
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      // Add the stats to the table
      stats.forEach((stat: AiStats) => {
        const tr = document.createElement('tr');
        const columns = ['match_date', 'player_one', 'ai_level', 'match_score', 'winner', 'match_duration'];

        columns.forEach((column: string) => {
          const td = document.createElement('td');
          if (column === 'match_date') {
            td.textContent = formatDate(stat.match_date);
          } else if (column === 'match_duration') {
            td.textContent = stat.match_duration.substring(3);
          } else {
            td.textContent = (stat as any)[column];
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
  };

  fillAiStats();
};

// Fill table with Tournament stats
// Function to fill the table
const fillTournamentTable = (): void => {
  // Clear the table
  statTable.innerHTML = '';

  // Create the table headers
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  const columns = ['db date', 'db player 1', 'db player 2', 'db player 3', 'db player 4', 'db winner', 'db duration'];

  columns.forEach((column: string) => {
    const th = document.createElement('th');
    th.setAttribute('data-translate', column);
    tr.appendChild(th);
    updateTextForElem(th, column);
  });

  thead.appendChild(tr);
  statTable.appendChild(thead);

  // Create the table body
  const tbody = document.createElement('tbody');
  statTable.appendChild(tbody);

  // Get the tournament stats and add them to the table
  const fillTournamentStats = async (): Promise<void> => {
    const response = await authFetch(`${BASE_URL}/api/tournament_history`);
    if (response.status === 200) {
      const stats: TournamentStats[] = await response.json();

      // If there are no stats
      if (stats.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', columns.length.toString());
        td.setAttribute('data-translate', 'no stats');
        updateTextForElem(td, 'no stats');
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      // Add the stats to the table
      stats.forEach((stat: TournamentStats) => {
        const tr = document.createElement('tr');
        const columns = ['date', 'player_one', 'player_two', 'player_three', 'player_four', 'winner', 'duration'];

        columns.forEach((column: string) => {
          const td = document.createElement('td');
          if (column === 'date') {
            td.textContent = formatDate(stat.date);
          } else if (column === 'duration') {
            td.textContent = stat.duration.substring(3);
          } else {
            td.textContent = (stat as any)[column];
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
  };

  fillTournamentStats();
};

    // Event listeners
    pvpBtn.addEventListener('click', () => {
        fillPvpTable();
    });

    aiBtn.addEventListener('click', () => {
        fillAiTable();
    });

    tournamentBtn.addEventListener('click', () => {
        fillTournamentTable();
    });

    // Initial load
    pvpBtn.classList.add('selected');
    fillPvpTable();
    fillGlobalStatTable();
}

///works???
//changed