declare module 'react-plotly.js' {
    import * as React from 'react';
    import Plotly from 'plotly.js-dist-min';
  
    interface PlotProps {
      data: Plotly.Data[];
      layout?: Partial<Plotly.Layout>;
      frames?: Partial<Plotly.Frame>[];
      config?: Partial<Plotly.Config>;
      onInitialized?: (figure: Plotly.Figure) => void;
      onUpdate?: (figure: Plotly.Figure) => void;
      onClick?: (data: Plotly.ClickEvent) => void;
      onHover?: (data: Plotly.HoverEvent) => void;
      onRelayout?: (data: Plotly.RelayoutEvent) => void;
    }
  
    const Plot: React.ComponentType<PlotProps>;
    export default Plot;
}