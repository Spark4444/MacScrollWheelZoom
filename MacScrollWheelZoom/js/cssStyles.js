const cssStyles = `.zoomOverlay {
    position: fixed;
    top: 0;
    right: 32%;
    background: #1f1f1f;
    color: #c7c7c7;
    padding: 0 17px;
    border-radius: 16px;
    z-index: 10000;
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 254px;
    height: 50px;
    font-family: helvetica;
    justify-content: space-between;
    font-size: 13px;
    transform-origin: top right;
    box-shadow: 0 4px 8px #0000004d;
    user-select: none;
}
.rightWrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 128px;
}

.button {
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 32px;
    width: 25px;
    height: 25px;
    transition: background 0.5s;
}

.buttonHover:hover {
  background: #343434;
}

.resetButton:hover {
  background: #363636;
}

.buttonHover:active {
  background: #4e4e4e;
}

.resetButton:active {
  background: #3a3a3a;
}

.resetButton {
    border: #047cb6 2px solid;
    cursor: pointer;
    display: flex;
    height: 38px;
    width: 64px;
    background: none;
    color: #a8c7fa;
    font-size: 13px;
    align-items: center;
    justify-content: center;
    transition: background 0.5s;
}

.grey {
  color: #5f5f5f;
}

.appear {
  animation: appear 0.3s linear;
}

.disappear {
  animation: disappear 0.3s linear;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes disappear {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@media (prefers-color-scheme: light) {
    .zoomOverlay {
      background: white;
      color: black;
    }

    .buttonHover:hover {
      background: #cfcfcf;
    }

    .resetButton:hover {
      background: #f2f2f2;
    }

    .buttonHover:active {
      background: #cccccc;
    }

    .resetButton:active {
      background: #efefef;
    }
    
    .resetButton {
      border: #a8c7fa 2px solid;
      color: #0b5ad6;
      background: none;
    }
    
    .grey {
      color: #b9b9b9;
    }
}`