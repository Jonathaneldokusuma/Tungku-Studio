import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import browserControls from './assets/browser-controls.svg';
import curveL from './assets/curve-l.svg';
import curveR from './assets/curve-r.svg';
import iconBack from './assets/icon-back.svg';
import iconClose from './assets/icon-close.svg';
import iconFavorite from './assets/icon-favorite.svg';
import iconForward from './assets/icon-forward.svg';
import iconHome from './assets/icon-home.svg';
import iconMore from './assets/icon-more.svg';
import iconPlus from './assets/icon-plus.svg';
import iconRefresh from './assets/icon-refresh.svg';
import iconSecure from './assets/icon-secure.svg';
import imageUserProfile from './assets/image-user-profile.png';
import rectangle1 from './assets/rectangle-1.png';

function BrowserUrlControls() {
  return (
    <div className="browser" data-node-id="124:344" data-name="Browser & URL Controls">
      <div className="browser-top" data-node-id="124:268" data-name="Toolbar - Browser Controls">
        <div className="browser-window-controls" data-node-id="124:273" data-name="Browser Controls">
          <img src={browserControls} alt="" />
        </div>

        <div className="tab-group" data-node-id="124:271" data-name="Tab & Plus">
          <div className="tab" data-node-id="124:288" data-name="Browser Tab / With Plus">
            <img className="curve curve-left" src={curveL} alt="" />
            <div className="tab-content" data-node-id="124:292" data-name="Favicon, Text, & Icons">
              <span className="favicon" data-node-id="124:300">
                <img src={rectangle1} alt="" />
              </span>
              <span className="tab-title" data-node-id="124:294">Tungku ERP</span>
              <img className="tab-close" src={iconClose} alt="" data-node-id="124:323" />
            </div>
            <span className="curve-right-wrap">
              <img className="curve curve-right" src={curveR} alt="" />
            </span>
          </div>
          <img className="tab-plus" src={iconPlus} alt="" data-node-id="124:321" />
        </div>
      </div>

      <div className="browser-toolbar" data-node-id="124:302" data-name="Toolbar - URL Controls">
        <div className="left-icons" data-node-id="124:316" data-name="Left Locked Icons">
          <img src={iconBack} alt="" />
          <img src={iconForward} alt="" />
          <img src={iconRefresh} alt="" />
          <img src={iconHome} alt="" />
        </div>

        <div className="url-bar" data-node-id="124:308" data-name="URL Bar">
          <img className="secure" src={iconSecure} alt="" data-node-id="124:315" />
          <div className="url-text" data-node-id="124:311">
            <span className="url-domain">tungku.com</span><span className="url-path">/dashboard</span>
          </div>
          <img className="favorite" src={iconFavorite} alt="" data-node-id="124:310" />
        </div>

        <div className="right-icons" data-node-id="124:305" data-name="Right Locked Icons">
          <img className="profile" src={imageUserProfile} alt="" data-node-id="124:307" />
          <img className="more" src={iconMore} alt="" data-node-id="124:306" />
        </div>
      </div>
    </div>
  );
}

function Packet() {
  return (
    <main className="packet" data-node-id="661:8023" data-name="Packet">
      <BrowserUrlControls />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<Packet />);

