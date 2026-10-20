import {Composition} from 'remotion';
import {TraderWatchLesson} from './components/TraderWatchLesson';
import {LiquiditySweep} from './components/LiquiditySweep';
import {TraderWatchHero} from './components/TraderWatchHero';
import {TraderWatchHeroPortrait} from './components/TraderWatchHeroPortrait';
import {TraderWatchSignalsGuide} from './components/TraderWatchSignalsGuide';
import {TraderWatchNewsGuide} from './components/TraderWatchNewsGuide';
import {TraderWatchNewsLive} from './components/TraderWatchNewsLive';
import {TraderWatchNewsReel} from './components/TraderWatchNewsReel';
import {TraderWatchNewsChart} from './components/TraderWatchNewsChart';
import {TraderWatchChartReel} from './components/TraderWatchChartReel';
import {TraderWatchTiers} from './components/TraderWatchTiers';
import {TraderWatchTiersPortrait} from './components/TraderWatchTiersPortrait';
import {TiersDeck, TiersColumns, TiersSpotlight} from './components/TraderWatchTiersVariants';
import {TiersColumnsPro} from './components/TiersColumnsPro';
import {DiagA, DiagB} from './components/Diag';
import {BasicEducation} from './components/BasicEducation';
import {ToolkitExplainer} from './components/ToolkitExplainer';
import {SignalValidation} from './components/SignalValidation';
import {AIDecisionRoom} from './components/AIDecisionRoom';
import {AlertAnatomy} from './components/AlertAnatomy';
import {OrderBlockSetup} from './components/OrderBlockSetup';
import {WebsiteHero} from './components/WebsiteHero';
import {QMPattern} from './components/QMPattern';
import {SupportResistance} from './components/SupportResistance';
import {SignalEngine} from './components/SignalEngine';
import {SignalEngineMY} from './components/SignalEngineMY';
import {PriceAction} from './components/PriceAction';
import {TrendVsRange} from './components/TrendVsRange';
import {AISignalApple, AISignalFrames} from './components/AISignalApple';
import {LLMExplainer} from './components/LLMExplainer';
import {TraderWatchAI} from './components/TraderWatchAI';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DiagA"
        component={DiagA}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DiagB"
        component={DiagB}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TraderWatchHero"
        component={TraderWatchHero}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TraderWatchHeroPortrait"
        component={TraderWatchHeroPortrait}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TraderWatchSignalsGuide"
        component={TraderWatchSignalsGuide}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TraderWatchNewsGuide"
        component={TraderWatchNewsGuide}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TraderWatchNewsLive"
        component={TraderWatchNewsLive}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{"events": [{"t": "12:30", "d": "Tue 20 Oct", "n": "Building Permits Prel", "fc": "1.4", "pv": "1.403"}, {"t": "12:30", "d": "Tue 20 Oct", "n": "Housing Starts", "fc": "1.3", "pv": "1.275"}, {"t": "18:00", "d": "Wed 28 Oct", "n": "Fed Interest Rate Decision", "fc": "", "pv": "4"}, {"t": "18:30", "d": "Wed 28 Oct", "n": "Fed Press Conference", "fc": "", "pv": ""}], "fetched": "fetched 18 Oct 19:53 UTC"}}
      />
      <Composition
        id="TraderWatchNewsReel"
        component={TraderWatchNewsReel}
        durationInFrames={1440}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{"events": [{"t": "12:30", "d": "Tue 20 Oct", "n": "Housing Starts", "fc": "1.3", "pv": "1.275"}, {"t": "18:00", "d": "Wed 28 Oct", "n": "Fed Interest Rate Decision", "fc": "", "pv": "4"}, {"t": "12:30", "d": "Thu 29 Oct", "n": "GDP Growth Rate QoQ Adv", "fc": "", "pv": "2.2"}, {"t": "12:30", "d": "Thu 29 Oct", "n": "Core PCE Price Index MoM", "fc": "", "pv": "0.2"}, {"t": "13:30", "d": "Fri 06 Nov", "n": "Non Farm Payrolls", "fc": "", "pv": "29"}, {"t": "13:30", "d": "Fri 06 Nov", "n": "Unemployment Rate", "fc": "", "pv": "4.2"}], "fetched": "fetched 18 Oct 20:06 UTC", "range": "20 Oct – 6 Nov", "count": 6}}
      />
      <Composition
        id="TraderWatchNewsChart"
        component={TraderWatchNewsChart}
        durationInFrames={1440}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{"events": [{"t": "12:30", "d": "Tue 20 Oct", "n": "Housing Starts", "fc": "1.3", "pv": "1.275"}, {"t": "18:00", "d": "Wed 28 Oct", "n": "Fed Interest Rate Decision", "fc": "", "pv": "4"}, {"t": "12:30", "d": "Thu 29 Oct", "n": "GDP Growth Rate QoQ Adv", "fc": "", "pv": "2.2"}, {"t": "12:30", "d": "Thu 29 Oct", "n": "Core PCE Price Index MoM", "fc": "", "pv": "0.2"}, {"t": "13:30", "d": "Fri 06 Nov", "n": "Non Farm Payrolls", "fc": "", "pv": "29"}, {"t": "13:30", "d": "Fri 06 Nov", "n": "Unemployment Rate", "fc": "", "pv": "4.2"}], "fetched": "fetched 18 Oct 20:06 UTC", "range": "20 Oct – 6 Nov", "count": 6}}
      />
      <Composition
        id="TraderWatchChartArea"
        component={TraderWatchChartReel}
        durationInFrames={1440}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{"events": [{"t": "12:30", "d": "Tue 20 Oct", "n": "Housing Starts", "fc": "1.3", "pv": "1.275"}, {"t": "18:00", "d": "Wed 28 Oct", "n": "Fed Interest Rate Decision", "fc": "", "pv": "4"}, {"t": "12:30", "d": "Thu 29 Oct", "n": "GDP Growth Rate QoQ Adv", "fc": "", "pv": "2.2"}, {"t": "12:30", "d": "Thu 29 Oct", "n": "Core PCE Price Index MoM", "fc": "", "pv": "0.2"}, {"t": "13:30", "d": "Fri 06 Nov", "n": "Non Farm Payrolls", "fc": "", "pv": "29"}, {"t": "13:30", "d": "Fri 06 Nov", "n": "Unemployment Rate", "fc": "", "pv": "4.2"}], "fetched": "fetched 18 Oct 20:06 UTC", "range": "20 Oct – 6 Nov", "count": 6, "variant": "area"}}
      />
      <Composition
        id="TraderWatchChartCandles"
        component={TraderWatchChartReel}
        durationInFrames={1440}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{"events": [{"t": "12:30", "d": "Tue 20 Oct", "n": "Housing Starts", "fc": "1.3", "pv": "1.275"}, {"t": "18:00", "d": "Wed 28 Oct", "n": "Fed Interest Rate Decision", "fc": "", "pv": "4"}, {"t": "12:30", "d": "Thu 29 Oct", "n": "GDP Growth Rate QoQ Adv", "fc": "", "pv": "2.2"}, {"t": "12:30", "d": "Thu 29 Oct", "n": "Core PCE Price Index MoM", "fc": "", "pv": "0.2"}, {"t": "13:30", "d": "Fri 06 Nov", "n": "Non Farm Payrolls", "fc": "", "pv": "29"}, {"t": "13:30", "d": "Fri 06 Nov", "n": "Unemployment Rate", "fc": "", "pv": "4.2"}], "fetched": "fetched 18 Oct 20:06 UTC", "range": "20 Oct – 6 Nov", "count": 6, "variant": "candle"}}
      />
      <Composition
        id="TraderWatchTiers"
        component={TraderWatchTiers}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TraderWatchTiersPortrait"
        component={TraderWatchTiersPortrait}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TiersDeck"
        component={TiersDeck}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TiersColumns"
        component={TiersColumns}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TiersSpotlight"
        component={TiersSpotlight}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TiersColumnsPro"
        component={TiersColumnsPro}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TraderWatchLesson"
        component={TraderWatchLesson}
        durationInFrames={940}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LiquiditySweep"
        component={LiquiditySweep}
        durationInFrames={1180}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BasicEducation"
        component={BasicEducation}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TraderWatchAI"
        component={TraderWatchAI}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ToolkitExplainer"
        component={ToolkitExplainer}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SignalValidation"
        component={SignalValidation}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AIDecisionRoom"
        component={AIDecisionRoom}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AlertAnatomy"
        component={AlertAnatomy}
        durationInFrames={1520}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OrderBlockSetup"
        component={OrderBlockSetup}
        durationInFrames={1520}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="WebsiteHero"
        component={WebsiteHero}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="QMPattern"
        component={QMPattern}
        durationInFrames={1520}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SupportResistance"
        component={SupportResistance}
        durationInFrames={1520}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SignalEngine"
        component={SignalEngine}
        durationInFrames={1520}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SignalEngineMY"
        component={SignalEngineMY}
        durationInFrames={1520}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PriceAction"
        component={PriceAction}
        durationInFrames={1520}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TrendVsRange"
        component={TrendVsRange}
        durationInFrames={1520}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AISignalApple"
        component={AISignalApple}
        durationInFrames={AISignalFrames}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LLMExplainer"
        component={LLMExplainer}
        durationInFrames={1520}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
