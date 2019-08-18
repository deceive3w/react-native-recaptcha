import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

// fix https://github.com/facebook/react-native/issues/10865
const patchPostMessageJsCode =`(function() {
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(data);
    };
  })()`;

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
//         if(this.webview){
//             console.log(this.props.execute())
//             this.webview.injectJavaScript(this.props.execute())
//         }
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
