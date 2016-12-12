import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image, 
  TouchableOpacity, 
  NativeModules, 
  Dimensions,
  Modal,
} from 'react-native';

import Video from 'react-native-video';
import ImagePicker from 'react-native-image-crop-picker';
import { getCloudinaryCredentials } from './actions';

const FileTransfer = NativeModules.FileTransfer;
const { width, height } = Dimensions.get('window');

export default class imageUpload extends Component {
    constructor() {
    super();
    this.state = {
      image: null,
      images: null,
      isModalActive: false,
      apiKey: null,
      signature: null,
      timestamp: null,
      url: null,
    };
    this.pickSingleWithCamera = this.pickSingleWithCamera.bind(this);
    this.pickSingle = this.pickSingle.bind(this);
  }
  
  pickSingleWithCamera(cropping) {
        console.log('hsdhfgahsgsgjasgjgfghjgadfhagshfghags');

    ImagePicker.openCamera({
      cropping,
      width: 500,
      height: 500
    }).then(image => {
      console.log('received image', image);
      this.setState({
        image: {uri: image.path, width: image.width, height: image.height},
        images: null,
        isModalActive: false,
      });
    }).catch(e => alert(e));
  }
  
  onSuccessfulUpload(response) {
    console.log(response);
  }

  onErrorUpload(error) {
    console.log(error);
  }

  pickSingle(cropit) {
    const token= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQwNSRnUEhaL0tmSkIvb0tWMDB3WVpFOTUuODlOLk1zdlllNXV6bTBIUUJBT25NVHNKRGhyTWE5NiIsIl9fdiI6MCwidXNlclJvbGUiOiJjb2FjaCIsIm1vYmlsZU51bWJlciI6Ijg5NDA1NDQwNzMiLCJlbWFpbCI6ImdhdXJhdmt1bWFyMDE1NkBnbWFpbC5jb20iLCJuYW1lIjoidGVzdFJhdGluZyIsInVwZGF0ZWRBdCI6IjIwMTYtMTItMDVUMDg6MTk6MzQuNjEyWiIsImNyZWF0ZWRBdCI6IjIwMTYtMTItMDVUMDg6MTk6MzQuNTk1WiIsIl9pZCI6IjU4NDUyMzE2MDA1MmZmMTljZjBkYmFkZSIsImlhdCI6MTQ4MDkyNjA1OH0.lChwzkPDGbpuZ-mN7s2mpTHK0E-_qgnUmqTZoF35fSg';
    getCloudinaryCredentials('image', token).then(response => {this.setState({
        apiKey: response.api_key,
        signature: response.signature,
        timestamp: response.timestamp,
        url: response.url,
      })
    }).catch(error => console.log("pick" + error));

    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
    }).then(image => {
    console.log('received image', image);
    const obj = {
          uri: image.path,
          uploadUrl: this.state.url,
          data: {
            api_key: this.state.apiKey,
            timestamp: this.state.timestamp,
            signature: this.state.signature,
          }
      };

      FileTransfer.upload(obj, (err, res) => {
        if(res) {
          this.onSuccessfulUpload(res);
        };
          if(err) {
          this.onErrorUpload(err);  
        }
      });

      this.setState({
        image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        images: null
      });

             }).catch(e => {
      console.log(e.code);
      alert(e);
    });
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true
    }).then(images => {
      this.setState({
        image: null,
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        }),
        isModalActive: false,
      });
    }).catch(e => alert(e));
  }
   
  scaledHeight(oldW, oldH, newW) {
    return (oldH / oldW) * newW;
  }

  renderVideo(uri) {
    return <View style={{height: 300, width: 300}}>
      <Video source={{uri}}
         style={{position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
         rate={1}
         paused={false}
         volume={1}
         muted={false}
         resizeMode={'cover'}
         onLoad={load => console.log(load)}
         onProgress={() => {}}
         onEnd={() => { console.log('Done!'); }}
         repeat={true} />
     </View>;
  }

  renderImage(image) {
    return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
  }

  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image.uri);
    }

    return this.renderImage(image);
  }



  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={
          {
            position: 'absolute',
            top: 100, 
            left: 40, 
            width: width - 80,
            height: height / 2, 
          }} 
          automaticallyAdjustContentInsets={true} 
          horizontal={true}
        >
          {this.state.image ? this.renderAsset(this.state.image) : null}
          {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
        </ScrollView>
        <View style={
          {
            position: 'absolute',
            top: 100 + (height / 2), 
            left: 40, 
            width: width - 80,
            height: height / 2, 
          }
         } 
        > 
          <TouchableOpacity onPress={() => this.setState({isModalActive: !this.state.isModalActive})} style={styles.button}>
            {this.state.isModalActive ? (null) : (<Text style={styles.text}> Edit Gallery </Text>)}
          </TouchableOpacity>
        </View>
        <Modal  
          animationType={"slide"}
          transparent={true}
          visible={this.state.isModalActive}
        >
            <View style={
              {
                position: 'absolute', 
                bottom: 0,
                height: height / 3,
                width: width,
                backgroundColor: 'green',
                justifyContent: 'center',
              }
            }>

              <TouchableOpacity onPress={() => this.pickSingleWithCamera(false)} style={styles.button}>
                <Text style={styles.text}> Capture Image </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.pickSingle(true)} style={styles.button}>
                <Text style={styles.text}>Select Image and Crop</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.pickMultiple.bind(this)} style={styles.button}>
                <Text style={styles.text}>Select Multiple Images</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.setState({isModalActive: false})} style={styles.button}>
                <Text style={styles.text}> Close </Text>
              </TouchableOpacity>
            </View>
        </Modal> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 20,
    height: height / 2,
    backgroundColor: 'green',
  },
  button: {
    backgroundColor: 'grey',
    marginBottom: 10,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  }
});

AppRegistry.registerComponent('imageUpload', () => imageUpload);
