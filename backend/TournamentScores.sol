// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TournamentScores {
    struct Match {
        uint256 id;
        string player_one;
        string player_two;
        string player_three;
        string player_four;
        string winner;
        uint256 duration;
        string date;
        uint256 user_id;
    }

    Match[] public matches;

    event MatchRecorded(uint256 id, string winner, uint256 user_id);

    function recordMatch(
        uint256 id,
        string memory player_one,
        string memory player_two,
        string memory player_three,
        string memory player_four,
        string memory winner,
        uint256 duration,
        string memory date,
        uint256 user_id
    ) public {
        matches.push(
            Match({
                id: id,
                player_one: player_one,
                player_two: player_two,
                player_three: player_three,
                player_four: player_four,
                winner: winner,
                duration: duration,
                date: date,
                user_id: user_id
            })
        );

        emit MatchRecorded(id, winner, user_id);
    }

    function getAllMatches() public view returns (Match[] memory) {
        return matches;
    }

    function getMatchCount() public view returns (uint256) {
        return matches.length;
    }
}
