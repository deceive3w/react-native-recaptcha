import React from 'react'
import { View,WebView } from 'react-native'

// fix https://github.com/facebook/react-native/issues/10865
const patchPostMessageJsCode =  `(function () {
    let originalPostMessage = window.postMessage;
    let patchedPostMessage = function(message, targetOrigin, transfer, ...other) { 
      originalPostMessage(message, targetOrigin, transfer, ...other);
    };

    patchedPostMessage.toString = function() { 
      return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;
  })()`

export default class MessageWebView extends React.Component {
    constructor(props) {
        super(props)
        this.postMessage = this.postMessage.bind(this)
        if(props.messageAction && props.execute){
            // alert(JSON.stringify(props.execute()))
            props.messageAction(()=>{
                this.webview.injectJavaScript(props.execute())
        
            })
        }
        this.state = {
            init: false
        }
    }
    postMessage(action) {
        this.WebView.postMessage(JSON.stringify(action))
    }

    getWebViewHandle = () => {
        return this.webview;
    }

    onError= () => {
        this.webview.reload()
    }

    render() {
        const { html, source, url, onMessage, ...props } = this.props
        if(this.webview && !this.state.init){
            console.log(this.props.execute())
            this.setState({
                init: true
            })
            this.webview.injectJavaScript(this.props.execute())
        }
        return (
            <View style={props.containerStyle}>
            <WebView
                {...props}
                originWhitelist={["*",'https://*', 'git://*']}
                style={props.containerStyle}
                javaScriptEnabled
                automaticallyAdjustContentInsets
                injectedJavaScript={patchPostMessageJsCode}
                source={source ? source : html ? { html } : url}
                ref={x => {this.webview = x}}
                onMessage={e => onMessage(e.nativeEvent.data)}
                onError={e => this.onError(e)}

            />
            </View>
        )
    }
}
