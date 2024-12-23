# 롤 챔피언 추천 웹사이트 만들기
## python code
### from flask import Flask, jsonify,Response
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
