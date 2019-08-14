var request=require('supertest')
const app= require('../app/app')
exports.Post= function (url, body,header){
    const httpRequest = request(app).post(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json')
    if(header!==null && header!==undefined){
        httpRequest.set('Authorization', header)
    }
    return httpRequest;
  }
  exports.Get= function (url,query,header){
    const httpRequest = request(app).get(url);
    httpRequest.query(query)
    httpRequest.set('Accept', 'application/json')
    if(header!==null && header!==undefined){
        httpRequest.set('Authorization', header)
    }
    return httpRequest;
  }
  exports.Delete=function (url, body,header){
    const httpRequest = request(app).delete(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json')
    httpRequest.set('Authorization', header)
    return httpRequest;
  }
  exports.Put=function (url, body,header){
    const httpRequest = request(app).put(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json')
    httpRequest.set('Authorization', header)
    return httpRequest;
  }
