import React from 'react';
import { JsonViewer } from '@textea/json-viewer';

export const ocean = {
  scheme: 'Ocean',
  author: 'Chris Kempson (http://chriskempson.com)',
  base00: '#2b303b',
  base01: '#343d46',
  base02: '#4f5b66',
  base03: '#65737e',
  base04: '#a7adba',
  base05: '#c0c5ce',
  base06: '#dfe1e8',
  base07: '#eff1f5',
  base08: '#bf616a',
  base09: '#d08770',
  base0A: '#ebcb8b',
  base0B: '#a3be8c',
  base0C: '#96b5b4',
  base0D: '#8fa1b3',
  base0E: '#b48ead',
  base0F: '#ab7967',
};

const JsonView = ({ className = 'jsonview', value }: any) => {
  console.log("🚀 ~ file: index.tsx:26 ~ JsonView ~ value", value)
  return <JsonViewer className={className} value={value} theme={ocean} />;
};

export default JsonView;
