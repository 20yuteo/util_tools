import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  // 環境変数の存在確認
  const apiKey = import.meta.env.VITE_API_KEY;
  const apiSecret = import.meta.env.VITE_API_SECRET_KEY;
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
  const accessTokenSecret = import.meta.env.VITE_ACCESS_TOKEN_SECRET;
  console.log({
    apiKey,
    apiSecret,
    accessToken,
    accessTokenSecret,
  })

  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    throw new Error('必要な環境変数が設定されていません');
  }

  const oauth = new OAuth({
    consumer: {
      key: apiKey,
      secret: apiSecret,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      const hash = CryptoJS.HmacSHA1(base_string, key);
      return CryptoJS.enc.Base64.stringify(hash);
    }
  });

  const request_data = {
    url: 'https://api.twitter.com/2/tweets',
    method: 'POST'
  };

  const token = {
    key: accessToken,
    secret: accessTokenSecret,
  };

  console.log('Consumer Key:', apiKey); // デバッグ用
  console.log('Access Token:', accessToken); // デバッグ用

  const authorization = oauth.authorize(request_data, token);
  const authParams = {
    oauth_consumer_key: authorization.oauth_consumer_key,
    oauth_nonce: authorization.oauth_nonce,
    oauth_signature: authorization.oauth_signature,
    oauth_signature_method: authorization.oauth_signature_method,
    oauth_timestamp: authorization.oauth_timestamp,
    oauth_token: token.key,
    oauth_version: "1.0"
  };

  const authHeaderString = Object.entries(authParams)
    .map(([key, value]) => `${key}="${encodeURIComponent(value)}"`)
    .join(', ');

  try {
    const response = await fetch(request_data.url, {
      method: request_data.method,
      headers: {
        'Authorization': `OAuth ${authHeaderString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: "Learn how to use the user Tweet timeline and user mention timeline endpoints in the X API v2"
      })
    });

    const data = await response.json();
    console.log('Response Status:', response.status); // デバッグ用
    console.log('Response Data:', data); // デバッグ用

    if (!response.ok) {
      throw new Error(data.detail || 'Tweet投稿に失敗しました');
    }
    
    return {
      message: "Tweet posted successfully",
      data
    };
  } catch (error) {
    console.error('Error details:', error); // デバッグ用
    throw new Error('Tweet投稿中にエラーが発生しました');
  }
}

export default function Home() {
  return <Welcome />;
}
