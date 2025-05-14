package cuketmon.battle.repository;

import cuketmon.battle.dto.BattleDTO;
import cuketmon.battle.dto.BattleDTO.Team;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import org.springframework.stereotype.Component;

@Component
public class WaitingQueue {

    private final Queue<Team> waitingQueue = new LinkedList<>();

    public boolean isContains(String trainerName) {
        return waitingQueue.stream().anyMatch(team -> team.getTrainerName().equals(trainerName));
    }

    public boolean isEmpty() {
        return waitingQueue.isEmpty();
    }

    public void add(Team team) {
        waitingQueue.add(team);
    }

    public BattleDTO.Team poll() {
        return waitingQueue.poll();
    }

    public void remove(String trainerName) {
        waitingQueue.removeIf(team -> team.getTrainerName().equals(trainerName));
    }

    public List<String> getState() {
        return waitingQueue.stream()
                .map(BattleDTO.Team::getTrainerName)
                .toList();
    }

}
