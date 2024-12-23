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