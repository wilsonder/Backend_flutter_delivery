const https = require('https');

module.exports = {


    sendNotification(token, data) {

        const notification = JSON.stringify({      
            'to': token,
            'data': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },

            'notification': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },

            'priority': 'high',
            'ttl': '4500s'
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAhCNpJNQ:APA91bG_3_QUBxQFdCnaOlw2XfmkZmxoBCxzkCsOJmBIC018FwIC3QRxVjk7szgOKWDzHAW7CLY-u7FDioYc0QuN8LC_JfPCWwNQ2Hn_kwZqp5Ueuj0ZnbdGzbl7XmlMDr48q8E24crl',            
            }
        }

        const req = https.request(options, (res) => {
            console.log('STATUS CODE FIREBASE', res.statusCode);

            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });

        req.on('error', (error) => {
            console.log('ERROR DE FIREBASE MESSAGING', error);
        });

        req.write(notification);
        req.end();

    },

    sendNotificationToMultipleDevice(tokens, data) {

        const notification = JSON.stringify({      
            'registration_ids': tokens,
            'data': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },

            'notification': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },

            'priority': 'high',
            'ttl': '4500s'
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAhCNpJNQ:APA91bG_3_QUBxQFdCnaOlw2XfmkZmxoBCxzkCsOJmBIC018FwIC3QRxVjk7szgOKWDzHAW7CLY-u7FDioYc0QuN8LC_JfPCWwNQ2Hn_kwZqp5Ueuj0ZnbdGzbl7XmlMDr48q8E24crl',            
            }
        }

        const req = https.request(options, (res) => {
            console.log('STATUS CODE FIREBASE', res.statusCode);

            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });

        req.on('error', (error) => {
            console.log('ERROR DE FIREBASE MESSAGING', error);
        });

        req.write(notification);
        req.end();

    }

}