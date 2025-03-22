import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
    onAction,
    registerActionTypes,
} from '@tauri-apps/plugin-notification';

export async function runTest() {
    let permissionGranted = await isPermissionGranted();
    console.log('Permission granted: ', permissionGranted);

    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
        console.log('Permission requested: ', permission);
    }

    await registerActionTypes([
        {
            id: 'messages',
            actions: [
                {
                    id: 'reply',
                    title: 'Reply',
                    input: true,
                    inputButtonTitle: 'Send',
                    inputPlaceholder: 'Type your reply...',
                },
                {
                    id: 'mark-read',
                    title: 'Mark as Read',
                    foreground: false,
                },
            ],
        },
    ]);

    console.log('Action types registered.');

    if (permissionGranted) {
        sendNotification({ title: 'Tauri', body: 'Tauri is awesome!' });
        console.log('Notification sent.');
    }
}
