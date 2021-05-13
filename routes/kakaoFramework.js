const express = require('express')
const kakaoMapKey = require('../config/kakaoKey')
const fetch = require("node-fetch")
const router = express.Router();
const data = require('../Data/address_file.json')
const request = require('request');




router.get('/',async(req,res)=>{
    res.render('kakao/kakao.ejs',{
        kakaoMap : kakaoMapKey.kakaoMap,
        data : data.list
    })
})

router.get('/loading',async(req,res)=>{
	res.render('loading/loading.ejs');
})

router.get('/test',async(req,res)=>{
	res.render('all.ejs',{
		kakaoMap : kakaoMapKey.kakaoMap,
        data : data.list,
		boolean : false
	})
})
module.exports = router;