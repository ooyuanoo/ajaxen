### Ajax简单封装

适用于简单的ajax请求，纯ajax实现，不依赖其他脚本，不使用es6，无需babel

使用方法：

```
<script src='./lib/index.min.js'></script>
<script>
    var http = new HttpReq();
    
    http.get(obj).then(function(res){
        console.log('成功')   
    }).catch(function(err){
        console.log('失败')   
    })
    
    http.post(obj).then(function(res){
        console.log('成功')   
    }).catch(function(err){
        console.log('失败')  
    })
    
    //如果是同步情况，需执行一个call()的回调，如下
    http.post({
        url: url,
        params: {},
        async: false
    }).then(function(res){
        console.log('成功')   
    }).catch(function(err){
        console.log('失败')  
    }).call()
</script>
```

obj参数

|参数名|必选|类型|说明|
|:----|:---|:-----|:-----|
|url|是|string|无|
|async|否|boolean|true-异步 false-同步|
|params|否|object|请求的参数|