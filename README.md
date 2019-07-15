# Installation

## 1. npm install
```js
npm install react-native-toastjs
```

## 2. Wrap top view with ToastProvider
```js
// before
<App />

// after
import ToastProvider from 'react-native-toastjs'
...

render(){
    return (
        <ToastProvider>
            <App />
        </ToastProvider>
    )
}
```
## 3. Using Toast
```js
import { Toast } from 'react-native-toastjs'
Toast('Toast 테스트').show()
```

# Example
```js
import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

import ToastProvider, { Toast } from 'react-native-toastjs'

class App extends React.Component {
    componentDidMount(){
        Toast('Toast 테스트').show()
    }
    render(){
        return (
        <SafeAreaView style={{ flex: 1 }}>
            <ToastProvider>{/* ToastProvider는 필수로 감싸줘야함 */}

                {/* My Real View */}
                <View style={{ flex: 1 }}>
                    <View style={{ height: 100, backgroundColor:'red' }}>
                        <Text>HEAD</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor:'blue' }}>
                        <Text>Body</Text>
                    </View>
                </View>

            </ToastProvider>
        </SafeAreaView>
        )
    }
};

export default App;
```

# Options

## Toast Position

#### position top
Toast('Toast 테스트', { position: 'top' }).show()

#### position bottom
Toast('Toast 테스트', { position: 'bottom' }).show()

#### duration 2000
+ 2000ms(2초) 동안 천천히 나타납니다
Toast('Toast 테스트').show({ duration: 2000 })

#### length 10000
+ toast가 나타난 후 10000ms(10초) 동안 유지되다가 사라집니다
Toast('Toast 테스트').show({ length: 10000 })
