import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useQRCodeScan } from '../.';

const App = () => {
console.log('useQRCodeScan', useQRCodeScan)
  return (
    <div>
      Hello
      {/* <Thing /> */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
