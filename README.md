# 롤 챔피언 추천 웹사이트 만들기
## python code

from flask import Flask, jsonify,Response
from flask_cors import CORS
import pandas as pd
import json

app = Flask(__name__)

# CORS 활성화 (모든 도메인에 대해 허용)
CORS(app)

@app.route('/champions')
def champions():
    try:
        df = pd.read_csv('champ.csv')

        df['championId'] = df['championId'].fillna(0).astype(int)
        
        champions_data = df[['championId', 'championName','mp','level','line','speed','intersection','class','help','weapon'
                             ,'damage','damage2','hp','hp2','armor','armor2','hpregen','hpregen2','attackspeed','attackspeed2']].to_dict(orient='records')

        print("챔피언 데이터:", champions_data) 

        
        return Response(
            json.dumps(champions_data, ensure_ascii=False), 
            mimetype='application/json'
        )
    except Exception as e:
        print(f"서버 오류: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)




## JS code
### API코드를 이용
apiKey = 'RGAPI-49c34c8c-8778-48c7-904d-71edb115cb45';
let puuid = ''; 

function getPuuid() {
        
    user = document.getElementById('riotId').value;
    tag = document.getElementById('tagLine').value;

    corsProxy = 'https://cors-anywhere.herokuapp.com/';
    url = `${corsProxy}https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(user)}/${encodeURIComponent(tag)}?api_key=${apiKey}`;

    $.ajax({
        type: "GET",
        url: url,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
            }
        })
        .done(function(response) {
            if (response && response.puuid) {
                puuid = response.puuid; 
                document.getElementById('puuid').textContent = '완료';
                console.log(puuid);
            } else {
                alert('PUUID를 가져오는 데 실패');
            }  
        })
        .fail(function(error) {
            console.error('API 요청 실패:', error);
            alert('API 요청 중 오류가 발생');
        }
        
)}

function getChampion() {
   
    corsProxy = 'https://cors-anywhere.herokuapp.com/';
    masteryUrl = `${corsProxy}https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?api_key=${apiKey}`;
    championDataUrl = "http://127.0.0.1:5000/champions"; 

    
    $.ajax({
    url: championDataUrl,
    type: 'GET',
    cache: false, 
    })
    .done(function(response) {

    let championData = response; 

    $.ajax({
        type: "GET",
        url: masteryUrl,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
            }
        })
        .done(function(response) {

            let masteryData = typeof response === 'string' ? JSON.parse(response) : response;
            console.log("데이터 확인:", masteryData);

            champion1 = masteryData[0];
            champion2 = masteryData[1];
            champion3 = masteryData[2];

                    
            function getChampionName(championId) {
                champion = championData.find(champ => champ.championId === championId);
                return champion ? champion.championName : "Unknown Champion";
            }

            champion1Name = getChampionName(champion1.championId);
            champion2Name = getChampionName(champion2.championId);
            champion3Name = getChampionName(champion3.championId);

            document.getElementById('championId1').textContent = `${champion1.championId}: ${champion1Name}`;
            document.getElementById('championId2').textContent = `${champion2.championId}: ${champion2Name}`;
            document.getElementById('championId3').textContent = `${champion3.championId}: ${champion3Name}`;

            championDetails1 = getChampionDetails(champion1.championId);
            championDetails2 = getChampionDetails(champion2.championId);
            championDetails3 = getChampionDetails(champion3.championId);

            function getChampionDetails(championId) {
                return championData.find(champ => champ.championId === championId);
            }

            if (championDetails1 && championDetails2 && championDetails3) {
                const commonAttributes = {};
                const keys = Object.keys(championDetails1);
        
                keys.forEach(key => {
                    if (
                        championDetails1[key] === championDetails2[key] &&
                        championDetails2[key] === championDetails3[key]
                    ) {
                        commonAttributes[key] = championDetails1[key];
                    }
                });
        
                const excludedChampionIds = [
                    champion1.championId,
                    champion2.championId,
                    champion3.championId
                ];
        
                const remainingChampions = championData.filter(
                    champ => !excludedChampionIds.includes(champ.championId)
                );
        
                console.log("제외된 챔피언을 제외한 나머지 챔피언:", remainingChampions);
        
                const similarChampions = remainingChampions.filter(champion => {
                    return Object.keys(commonAttributes).every(key => {
                        return champion[key] === commonAttributes[key];
                    });
                });
        
                console.log("공통 속성을 가진 챔피언:", similarChampions);
                
                document.getElementById('result').textContent =
                    `공통 속성 값: ${Object.values(commonAttributes).join(', ')}\n`;

                document.getElementById('result2').textContent =
                    `공통 속성을 가진 챔피언: ${similarChampions.map(champ => champ.championName).join(', ')}`;
            }
        })
        .fail(function(error) {
            alert('데이터를 가져오는 데 실패');
        });
    })
}

## CSS code

body {
    font-family: 'Arial', sans-serif;
    background-color: #121212;
    color: #ffffff;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}
header {
    background-color: #1e1e1e;
    width: 100%;
    padding: 20px 0;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}
header h1 {
    margin: 0;
    font-size: 2.5em;
    font-weight: 600;
    color: #f5f5f5;
}
main {
    padding: 20px;
    width: 90%;
    max-width: 600px;
    background-color: #1e1e1e;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    margin: 20px 0;
}
label {
    display: block;
    margin: 10px 0 5px;
    font-size: 1.1em;
    font-weight: bold;
    color: #ffffff;
}
input {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid #333333;
    border-radius: 6px;
    font-size: 1em;
    background-color: #121212;
    color: #ffffff;
    box-sizing: border-box;
}
input {
    text-align: center; 
}

input::placeholder {
    color: #666666;
}
button {
    width: 48%;
    padding: 12px;
    margin: 5px 1%;
    border: none;
    border-radius: 6px;
    background-color: #333333;
    color: #ffffff;
    font-size: 1em;
    cursor: pointer;
    
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}
button:hover {
    background-color: #444444;
}
h2 {
    font-size: 1.8em;
    margin-top: 20px;
    color: #f5f5f5;
}
p {
    background-color: #1e1e1e;
    padding: 12px;
    border: 1px solid #333333;
    border-radius: 6px;
    margin: 8px 0;
    font-size: 1.1em;
    
    color: #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}
@media (max-width: 480px) {
    button {
        width: 100%;
        margin: 5px 0;
    }
}
