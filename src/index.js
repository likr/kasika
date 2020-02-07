import React, { Component } from 'react';
import { render } from 'react-dom';
import { StaticMap } from 'react-map-gl';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';



// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoieS1saWtyIiwiYSI6ImNpZzlhemtjbjBkYmN0YWx0YTZjODVlZm4ifQ.z49ZPJ8RYCLWc9q-ybKBMQ'; // eslint-disable-line

// Source data CSV
const DATA_URL = 'data.csv'

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  // color: [0, 0,0],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight1, pointLight2 });

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
};

const INITIAL_VIEW_STATE = {
  longitude: 137.548828,//-1.4157267858730052,
  latitude: 35.663446,//52.232395363869415,
  zoom: 6.6,
  minZoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: -27.396674584323023
};

const colorRange = [
  [1, 152, 189, 100],
  [73, 227, 206, 100],
  [216, 254, 181, 100],
  [254, 237, 177, 100],
  [254, 173, 84, 100],
  [209, 55, 78, 100]
];

const elevationScale = { min: 1, max: 50 };

/* eslint-disable react/no-deprecated */
export default class App extends Component {
  static get defaultColorRange() {
    return colorRange;
  }

  constructor(props) {
    super(props);
    this.state = {
      elevationScale: elevationScale.min
    };
  }

  _renderLayers() {
    const { data, radius = 1000, upperPercentile = 100, coverage = 1 } = this.props;

    return [
      new HexagonLayer({
        id: 'heatmap',
        colorRange,
        coverage,
        data,
        // upperPercentile:99,
        elevationUpperPercentile: 100,//99.97,
        elevationRange: [0, 1500],
        elevationScale: data && data.length ? 50 : 0,
        colorDomain: [0, 500],
        extruded: true,
        getPosition: d => d,
        onHover: info => {
          console.log(info)
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          })
        },// this.props.onHover,
        pickable: true,// Boolean(this.props.onHover),
        radius,
        upperPercentile,
        material,


        transitions: {
          elevationScale: 3000
        }
      })
    ];
  }

  _renderTooltip() {
    const { hoveredObject, pointerX, pointerY } = this.state || {};
    return hoveredObject && (
      <div style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none', left: pointerX, top: pointerY }}>
        <p>{pointerX}</p>
        <p>{pointerY}</p>

      </div>
    );
  }



  render() {
    const { mapStyle = 'mapbox://styles/mapbox/dark-v9' } = this.props;




    return (
      <div>

        <>
          <section className="section">
            <div className="container">
              <div className="content has-text-centered">
                <h3>2019年度尾上ゼミ 情報科学講究1 課題制作</h3>
                <h1>地理的分布の可視化</h1>
                <h3>データの説明</h3>
                <p>Twitterで2011/1/1 - 2017/6/30の6年間においてツイートされたキーワードを収集し、
                  その位置情報（緯度経度）を得たものをCSVファイルで作成し、それを用いて可視化している。
                </p>
                <div >
                  <p>収集したデータのキーワードは下記の物である。</p>
                  <p>放射 OR 被ばく OR 被曝 OR 被爆 OR 除染 OR 線量 OR ヨウ素 OR セシウム OR シーベルト OR Sv OR mSV OR μSV OR uSV OR msv OR μsv OR usv OR ベクレル OR Bq OR ガンマ線 OR γ線 OR 核種 OR 甲状腺 OR 甲状線 OR チェルノブイリ OR 規制値 OR 基準値 OR 学会 OR 警戒区域 OR 避難区域 OR 産科婦人科 OR 周産期・新生児医 OR 日本疫 OR 核医 OR 電力中央 OR 学術会議 OR 環境疫 OR 物理学会 OR プルトニウム OR ストロンチウム OR 暫定基準 OR 暫定規制 OR 屋内退避 OR 金町浄水場 OR 出荷制限 OR 管理区域 OR 避難地域 OR モニタリング OR スクリーニング OR ホットスポット OR 汚染 OR (検査 (食品 OR 水 OR 土)) OR (リスク (がん OR ガン OR 癌)) OR (影響 (妊婦 OR 妊娠 OR 出産 OR 子ども OR 子供 OR こども OR 児)) OR 母子避難 OR 避難弱者 OR 自主避難 OR 避難関連死 OR 避難死 OR ((福島 OR ふくしま OR フクシマ) (避難 OR 米 OR 野菜 OR 牛肉 OR 食品 OR 産 OR 安全 OR 安心 OR 不安 OR 検査)) OR サーベイメータ OR 半減期 OR 遮蔽 OR 疫学 OR ICRP OR IAEA OR WHO OR コーデックス委員会 OR ECRR OR JCO事故 OR 東海村事故 OR 東海村臨界 OR 臨界事故 OR (検査 (野菜 OR 山野草 OR 魚)) OR 東電 OR 東京電力 OR 安全委 OR 保安院 OR 規制庁 OR 規制委 OR 安全厨 OR 危険厨 OR 廃炉 OR メルトダウン OR 吉田調書 OR 再稼働 OR 反原発 OR 御用学者 OR アイソトープ OR 同位体 OR 同位元素 OR いちえふ OR 第五福竜 OR ビキニ事件 OR ビキニ事故 OR 死の灰 OR 風評 OR UNSCEAR OR ((原発 OR 原子力 OR 福島 OR ふくしま OR フクシマ OR 避難) AND 健康) OR ((福島 OR ふくしま OR フクシマ OR 検査) AND きのこ) OR ((福島 OR ふくしま OR フクシマ) AND 過剰 AND (診断 OR 治療 OR 診療)) OR ((原発 OR 原子力 OR 福島 OR ふくしま OR フクシマ) AND (日テレ OR TBS OR ＴＢＳ OR フジ OR 朝日 OR テレ朝 OR NHK OR ＮＨＫ OR NEWS OR News OR news OR ＮＥＷＳ OR Ｎｅｗｓ OR ｎｅｗｓ OR ニュース OR バンキシャ OR Nスタ OR Ｎスタ OR 報道 OR サンデーモーニング OR クローズアップ OR クロ現 OR 古舘 OR 古館 OR 関口 OR 宮根 OR 池上彰 OR 読売 OR 毎日 OR 産経 OR テレビ OR 番組 OR 新聞 OR 報道 OR マスコミ OR メディア OR 民放 OR 民報 OR 民友 OR 放送 OR FM OR ＦＭ OR ラジオ OR 通信)
</p>
</div>
                <h3>可視化の説明</h3>
                <p>Deck.glでJavaScriptを用いてHexagonLayerを可視化した。<br></br>
                
                  HexagonLayerは地理情報を三次元で可視化できる。
                  地図を六角形に分割する。
                  分割したそれぞれの境界内にある位置情報の要素を、積み上げていき、「積み上げ棒グラフ」を地図上で可視化する。
                 
                  なぜ分割に六角形を用いているかと言うと、地球は丸いので、それを平面で表現する時にも同じように面積を分割できるようにするためである。
                  そうすることで平面でも拡大、縮小したレイアウトに対して柔軟に対応できる。
                 
                  ツイートの位置情報量を可視化することで、どこで多くツイートされているかを地理的分布で分析することができる。

                  <br></br>
                  今回は収集した全てのデータ（45402件）を用いている。
                  全てのデータを可視化してみたところ、東京周辺に他とは明らかに差が大きすぎる（グラフが高すぎる）グラフが現れた。
                  それを削除し、他のグラフの可視化結果がわかるように下記の事を行った。
                  <br></br>
                  「elevationUpperPercentile」を用いて、標高値の再設定を行った。設定した値より大きい物は非表示にした。
                  「elevationRange」を用いて、標高の出力範囲を設定した。
                   カラー設定を行っている「colorRange」で色の透過を行い、地図上の地名がわかるようにした。
                  積み上げ棒グラフにマウスを持っていくと、その積み上げ棒グラフに対して「経緯・緯度」が表示されるようにした。

                </p>

                <p style={{ position: 'relative', height: '500px', textAlign: 'left' }}>
                  <DeckGL

                    //style={{ margin: 10}}
                    //width={1000}
                    //height={300}
                    layers={this._renderLayers()}
                    effects={[lightingEffect]}
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={true}
                  >



                    <StaticMap
                      reuseMaps
                      mapStyle={mapStyle}
                      preventStyleDiffing={true}
                      mapboxApiAccessToken={MAPBOX_TOKEN}
                    />

                    {this._renderTooltip()}

                  </DeckGL>
                </p>
                <h3>可視化結果の考察</h3>
                <p>東京周辺に積み上げグラフが密集しているかつ棒グラフが高いことがわかる。
                一年ごとに分けたら東京意外の場所で高い棒グラフが見れるかもしれないが、
                ６年間の合計なので、人口の多いところでツイートが多くされているのではないかと考えられる。
                東京で多く話題になっていることがわかるが、福島で多くのツイートが見られることから、
                首都圏だけではなく被災地でも根強く関心を集めていると考えられる。
                
                東京と大阪で比較をする。
                2015年では東京の人口が約927万人に大して、
                大阪の人口は約884万人と人口が40万人しか変わらなかった。他の年もあまり差の変化はない。
                東京に比べて大阪では目立つような高いグラフが見えないことから、
                二大都市でも興味関心の差が出てきていると考えらえる。




                </p>

              </div>
            </div>
          </section>
          <footer className="footer">
            <div className="content has-text-centered">
              <p>&copy;2019 船木駿之介, 望月沙和</p>
            </div>
          </footer>
        </>
      </div>
    );
  }
}

require('d3-request').csv(DATA_URL, (error, response) => {
  if (!error) {
    const data = response.map(d => [Number(d.lng), Number(d.lat)]);
    render(<App data={data} />, document.getElementById('app'));
  }
});
