import { launchImageLibraryAsync, PermissionStatus, MediaTypeOptions, useMediaLibraryPermissions } from 'expo-image-picker';
import { Button } from '../Button/Button';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts, Radius } from '../tokens';
import UploadCloudIcon from '../../assets/icons/upload-cloud';
import FormData from 'form-data';
import axios from 'axios';
import { API_URL } from '../../src/constants/Config';
import { useAtom } from 'jotai';
import { authAtom, currentUserAtom } from '../../entities/auth/model/auth.state';

interface UploadButtonProps {
    onUpload: (uri: string) => void;
    onError: (error: string) => void;
}

export function UploadButton({ onUpload, onError }: UploadButtonProps) {
    const [image, setImage] = useState<string | null>(null);
    const [auth] = useAtom(authAtom);
    const [user, setUser] = useAtom(currentUserAtom);
    const [libraryPermission, requestLibraryPermission] = useMediaLibraryPermissions();

    const upload = async () => {
        try {
            if(!(await varifyMediaPermissions())) {
                onError('Недостаточно прав');
                return;
            }
            
            const asset = await pickAvatar();
            if(!asset) {
                onError('Не выбрано изображение');
                return;
            }
            
            const uploadedUrl = await uploadToServer(asset.uri, asset.fileName ?? '');
            if(!uploadedUrl) {
                onError('Не удалось загрузить изображение');
                return;
            }

            if (user) {
                setUser({ ...user, photo: uploadedUrl });
            }
            
            onUpload(uploadedUrl);
        } catch (error) {
            onError('Произошла ошибка при загрузке');
            console.error(error);
        }
    }
    
    const varifyMediaPermissions = async () => { 
        if (libraryPermission?.status === PermissionStatus.UNDETERMINED) { 
            const res = await requestLibraryPermission();
            return res.granted;
        }
        if (libraryPermission?.status === PermissionStatus.DENIED) {
            Alert.alert('Недостаточно прав для доступа к галерее');
            return false;
        }
        return true;
    }

    const pickAvatar = async () => {
        const result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        })
        if (!result.assets) {
            return null;
        }
        return result.assets[0]
    }

    const uploadToServer = async (uri: string, name: string) => {
        const formData = new FormData();
        formData.append('photo', {
            uri,
            name: name || `photo_${Date.now()}.jpg`,
            type: 'image/jpeg',
        } as any);
    
        try {
            const response = await axios.patch(`${API_URL}/api/profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${auth.access_token}`
                },
            });
            return response.data.user.photo;
        } catch (error) {
            console.error('Upload error:', error);
            return null;
        }
    }

    return (
        <Pressable onPress={upload}>
            <View style={styles.uploadButton} >
                <UploadCloudIcon />
                <Text style={styles.text}>Загрузить изображение</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    uploadButton: {
        backgroundColor: Colors.violetDark,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: Radius.r10,
        height: 58,
        paddingHorizontal: 20,
        paddingVertical: 17,
        marginTop: 15,
    },
    text: {
        color: Colors.white,
        fontSize: Fonts.f14,
        fontFamily: 'FiraSans',
        marginLeft: 10,
    }
});

function setUser(arg0: any) {
    throw new Error('Function not implemented.');
}
