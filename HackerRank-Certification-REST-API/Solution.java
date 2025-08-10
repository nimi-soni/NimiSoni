import java.io.*;
import java.math.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.*;
import java.text.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.regex.*;
import java.util.stream.*;

import org.json.JSONArray;
import org.json.JSONObject;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import java.net.*;
import org.json.*;

class Result {

    public static int getTotalGoals(String team, int year) {
        int totalGoals = 0;
        try {
            // Home team goals
            totalGoals += getGoals(team, year, "team1");
            // Away team goals
            totalGoals += getGoals(team, year, "team2");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return totalGoals;
    }

    private static int getGoals(String team, int year, String teamType) throws Exception {
        int totalGoals = 0;
        int page = 1;
        int totalPages = 1;

        while (page <= totalPages) {
            // API URL
            String urlString = String.format(
                "https://jsonmock.hackerrank.com/api/football_matches?year=%d&%s=%s&page=%d",
                year, teamType, URLEncoder.encode(team, "UTF-8"), page
            );

            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            in.close();

            // Parse JSON
            JSONObject json = new JSONObject(response.toString());
            totalPages = json.getInt("total_pages");
            JSONArray matches = json.getJSONArray("data");

            for (int i = 0; i < matches.length(); i++) {
                JSONObject match = matches.getJSONObject(i);
                String goalsStr = match.getString(teamType + "goals");
                totalGoals += Integer.parseInt(goalsStr);
            }

            page++;
        }

        return totalGoals;
    }
}

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(System.getenv("OUTPUT_PATH")));

        String team = bufferedReader.readLine();

        int year = Integer.parseInt(bufferedReader.readLine().trim());

        int result = Result.getTotalGoals(team, year);

        bufferedWriter.write(String.valueOf(result));
        bufferedWriter.newLine();

        bufferedReader.close();
        bufferedWriter.close();
    }
}
