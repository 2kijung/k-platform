package com.kplatform.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kplatform.backend.util.WgsToKatecConverter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api")
public class GasController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @GetMapping("/gas")
    public ResponseEntity<Map<String, Object>> getGasInfo(
            @RequestParam double lat,
            @RequestParam double lng) {

        String apiKey = "F251103967";

        // 좌표 변환
        Point2D katecPoint = WgsToKatecConverter.convert(lat, lng);
        double x = katecPoint.getX();
        double y = katecPoint.getY();

        int radius = 1000; // 시작 반경
        int maxRadius = 5000; // 최대 반경
        int minStations = 10;

        List<Map<String, Object>> stations = new ArrayList<>();

        while (radius <= maxRadius && stations.size() < minStations) {
            String url = "https://www.opinet.co.kr/api/aroundAll.do?code=" + apiKey +
                    "&x=314681.8&y=544837" +
                    "&radius=5000" +
                    "&prodcd=B027" +
                    "&sort=2" +
                    "&out=json";
            try {
                String response = restTemplate.getForObject(url, String.class);
                JsonNode root = mapper.readTree(response);
                JsonNode oilList = root.path("RESULT").path("OIL");

                if (oilList.isArray()) {
                    for (JsonNode node : oilList) {
                        stations.add(mapper.convertValue(node, Map.class));
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            radius += 1000;
        }

        Map<String, Object> result = new HashMap<>();
        Map<String, Object> inner = new HashMap<>();
        inner.put("OIL", stations);
        result.put("RESULT", inner);

        return ResponseEntity.ok(result);
    }

    private String optionalString(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v == null ? "" : String.valueOf(v);
    }
}