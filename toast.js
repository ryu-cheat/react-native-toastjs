import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    ViewStyle,
} from 'react-native';

interface ToastOption{
    animation(animationValue_0to1: Animated): ViewStyle;
    position: 'top' | 'bottom'
}

interface ShowOptions{
    // 나타나는 시간, 사라지는 시간(ms) : 기본 값 300(ms)
    duration: Number;

    // Toast가 떠있는 시간(ms) : 기본 값(2500ms)
    length: Number;
}

interface ToastInterface {
    show(options: ShowOptions, showCallback: showCallbackInterface, hideCallback: Function): ToastInterface;
    hide(hideCallback: Function): ToastInterface;
    remove(removeCallback: Function): ToastInterface;
    
    animationOption: ShowOptions;
}

let Toaster = null // ToastWrapper에서 초기화

const _CustomToast = (view, option): ToastInterface => {
    if (Toaster == null) {
        throw new Error('Root View를 ToastProvider로 감싸주세요. 예) <ToastProvider><App /><ToastProvider>')
    }
    return Toaster(view, option)
}

export const CustomToast = (view: React.ReactNode, option:ToastOption = {}): ToastInterface => _CustomToast(view, option)
export const Toast = (text, option:ToastOption = {}): ToastInterface => _CustomToast(<DefaultToast text={text} />, option)

export default class ToastProvider extends React.Component{
    render(){
        return (<View style={style.toastProvider}>
            <ToastWrapper />
            <View style={style.children}>{this.props.children}</View>
        </View>)
    }
}

class ToastWrapper extends React.Component{
    state = {}
    constructor(p){
        super(p)
        Toaster = this.createToaster
    }

    views = []
    createToaster = (_view: React.ReactNode, toastOption: ToastOption) => {
        let animationValue = new Animated.Value(0)
        let animationValueTiming = Animated.timing(animationValue, { })
        let animationTimeout = { timeout: null, clear: function () { try{ clearTimeout(this.timeout) } catch (e) {} } }
        if (!toastOption) {
            toastOption = {}
        }
        if (!toastOption.animation) {
            toastOption.animation = () => ({})
        }
        if (!toastOption.position) {
            toastOption.position = 'bottom'
        }

        let position = ({ top: style.toastTop, bottom: style.toastBottom })[toastOption.position]
        let view = (
            <Animated.View key={this.views.length} style={[position, { opacity: animationValue }, toastOption.animation(animationValue)]}>
                {_view}
            </Animated.View>
        )
        let idx = this.views.push(null)-1

        function Toast({ wrapper }): ToastInterface {
            this.wrapper = wrapper
            this.animationOption = {}
        }
        Toast.prototype.show = function (option: ShowOptions = {}, showCallback: Function, hideCallback: Function) {
            if (!option) option = {};
            if (option.duration == null || option.duration < 0) option.duration = 300;
            if (option.length == null || option.length < 0) option.length = 2500;

            this.animationOption = option
            animationTimeout.clear()
            animationValueTiming.stop()
            
            this.wrapper.views[idx] = view

            this.wrapper.setState({},()=>{
                animationValueTiming = Animated.timing(animationValue, {
                    duration: option.duration,
                    toValue: 1,
                })
                animationValueTiming.start(() => {
                    typeof showCallback == 'function' && showCallback.call(this, this)
                    animationTimeout.timeout = setTimeout(()=>{
                        this.hide(hideCallback)
                    }, option.length)
                })
            })

            return this
        }
        Toast.prototype.remove = function (callback: Function) {
            this.wrapper.views[idx] = null
            this.wrapper.setState({ }, callback)
        }
        Toast.prototype.hide = function (callback: Function) {
            animationTimeout.clear()
            animationValueTiming.stop()

            animationValueTiming = Animated.timing(animationValue, {
                duration: this.animationOption.duration,
                toValue: 0,
            })
            animationValueTiming.start(() => {
                this.remove()
                typeof callback == 'function' && callback.call(this, this)
            })

            return this
        }

        return new Toast({
            wrapper: this,
        })
    }

    render(){
        return this.views
    }
}


const DefaultToast = (props) => (
    <View style={style.defaultToastWrapper}>
        <View style={style.defaultToast}>
            <Text style={style.defaultToastText}>{props.text}</Text>
        </View>
    </View>
)

const style = StyleSheet.create({
    toastProvider: {
        position:'relative',
        flex: 1,
        zIndex:1,
    },
    children: {
        position:'absolute',
        top:0,
        right:0,
        bottom:0,
        left:0,
        zIndex:1,
    },
    toastBottom:{
        position:'absolute',
        zIndex:2,

        right:0,
        bottom:20,
        left:0,
    },
    toastTop:{
        position:'absolute',
        zIndex:2,

        right:0,
        top:20,
        left:0,
    },

    defaultToastWrapper:{
        alignItems:'center',
    },
    defaultToast:{
        padding:8,
        borderRadius:5,
        backgroundColor:'rgba(0,0,0,.7)',
        marginHorizontal:20,
    },
    defaultToastText:{
        color: '#fff',
        fontSize: 13,
    },
})