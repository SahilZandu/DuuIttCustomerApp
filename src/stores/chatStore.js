import { action, computed, decorate, observable, runInAction } from 'mobx';
import { agent } from '../api/agent';
import { rootStore } from './rootStore';
import { useToast } from '../halpers/useToast';

export default class ChatStore {


    sendMessage = async (data) => {
        let requestData = {
            orderId: data?.orderId,
            senderRole: data?.senderRole,
            message: data?.message,
            riderId: data?.riderId,
            customerId: data?.customerId
        };

        console.log('requestData:-', requestData);
        try {
            const res = await agent.sendMessage(requestData);
            console.log('sendMessage API Res:', res);
            if (res?.statusCode == 200) {
                useToast(res.message, 1);
            } else {
                const message = res?.message ? res?.message : res?.data?.message;
                useToast(message, 0);
            }
        } catch (error) {
            console.log('error:', error);
            const m = error?.data?.message
                ? error?.data?.message
                : 'Something went wrong';
            useToast(m, 0);
        }
    };


    markSeen = async (data) => {
        let requestData = {
            orderId: data?.orderId,
            senderRole: data?.senderRole,
        };

        console.log('requestData:-', requestData);
        try {
            const res = await agent.markSeen(requestData);
            console.log('markSeen API Res:', res);
            if (res?.statusCode == 200) {
                // useToast(res.message, 1);
            } else {
                const message = res?.message ? res?.message : res?.data?.message;
                // useToast(message, 0);
            }
        } catch (error) {
            console.log('error:markSeen', error);
            const m = error?.data?.message
                ? error?.data?.message
                : 'Something went wrong';
            // useToast(m, 0);
        }
    };


    getChatData = async (data, handleLoading) => {
        let requestData = {
            orderId: data?.orderId,
        };

        console.log('requestData:-getChatData', requestData);
        try {
            const res = await agent.chatOrderId(requestData);
            console.log('getChatData API Res:', res);
            if (res?.statusCode == 200) {
                handleLoading(false);
                // useToast(res.message, 1);
                return res ;
            } else {
                handleLoading(false);
                const message = res?.message ? res?.message : res?.data?.message;
                useToast(message, 0);
                return res ;
            }
        } catch (error) {
            console.log('error:getChatData', error);
            handleLoading(false);
            const m = error?.data?.message
                ? error?.data?.message
                : 'Something went wrong';
            useToast(m, 0);
        }
    };


}
