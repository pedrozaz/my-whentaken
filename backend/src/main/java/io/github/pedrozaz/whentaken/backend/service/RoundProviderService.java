package io.github.pedrozaz.whentaken.backend.service;

import io.github.pedrozaz.whentaken.backend.model.RoundData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service

public class RoundProviderService {

    public List<RoundData> getRandomRounds(int count) {

        List<RoundData> candidates = new ArrayList<>(getFallbackRounds());

        Collections.shuffle(candidates);
        return candidates.subList(0, Math.min(candidates.size(), count));
    }

    private List<RoundData> getFallbackRounds() {
        return List.of(
                new RoundData("https://upload.wikimedia.org/wikipedia/commons/a/af/Eiffel_Tower_1900_01.jpg", 48.8584, 2.2945, 1900),
                new RoundData("https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg", 40.7484, -73.9857, 1931),
                new RoundData("https://upload.wikimedia.org/wikipedia/commons/3/3a/Berlin_Wall_1989_fall.jpg", 52.5163, 13.3777, 1989),
                new RoundData("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/New_York_City_-_Times_Square_1950.jpg/800px-New_York_City_-_Times_Square_1950.jpg", 40.757, -73.986, 1950)
        );
    }
}