# node-PRTG
A Node.js module for interacting with the PRTG API. 

## Requirements

- PRTG 14.x+, earlier versions may work but have not been tested. 
- Node.js v0.10+

## Usage

```javascript

    var PRTG = require('node-PRTG');
    
    var api = new PRTG({
            url: 'http://your.prtg.install.com',
            username: 'username',
            passhash: '123456789'
    });
    
    api.getSensor(1234).then( /*do something with result*/ ).fail( /* handle errors */ );
    
```

## Classes

<dl>
<dt><a href="#PRTG">PRTG</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Sensor">Sensor</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#SensorColumns">SensorColumns</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="PRTG"></a>
## PRTG
**Kind**: global class  

* [PRTG](#PRTG)
    * [new PRTG(options)](#new_PRTG_new)
    * [.getDefaults()](#PRTG+getDefaults) ⇒ <code>Object</code> &#124; <code>\*</code>
    * [.getStatus(str)](#PRTG+getStatus) ⇒ <code>string</code> &#124; <code>number</code>
    * [.api(path, resultPath, [parse])](#PRTG+api) ⇒ <code>promise</code> &#124; <code>object</code>
    * [.getSensor(objid)](#PRTG+getSensor) ⇒ <code>\*</code> &#124; <code>promise</code> &#124; <code>[Sensor](#Sensor)</code>
    * [.getDeviceSensors(objid, [columns])](#PRTG+getDeviceSensors) ⇒ <code>\*</code> &#124; <code>promise</code> &#124; <code>[Array.&lt;Sensor&gt;](#Sensor)</code>
    * [.getObjectProperty(objid, property)](#PRTG+getObjectProperty) ⇒ <code>promise</code> &#124; <code>Object</code>
    * [.getSensorStatusId(objid)](#PRTG+getSensorStatusId) ⇒ <code>\*</code> &#124; <code>promise</code> &#124; <code>string</code>

<a name="new_PRTG_new"></a>
### new PRTG(options)

| Param | Description |
| --- | --- |
| options |  |
| options.username |  |
| options.passhash |  |
| options.url | Base URL of your PRTG installation, e.g. the API is accessible at <url>/API/ |

<a name="PRTG+getDefaults"></a>
### prtg.getDefaults() ⇒ <code>Object</code> &#124; <code>\*</code>
**Kind**: instance method of <code>[PRTG](#PRTG)</code>  
<a name="PRTG+getStatus"></a>
### prtg.getStatus(str) ⇒ <code>string</code> &#124; <code>number</code>
Return opposite mapping for status to status id

**Kind**: instance method of <code>[PRTG](#PRTG)</code>  

| Param |
| --- |
| str | 

<a name="PRTG+api"></a>
### prtg.api(path, resultPath, [parse]) ⇒ <code>promise</code> &#124; <code>object</code>
**Kind**: instance method of <code>[PRTG](#PRTG)</code>  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> |  |
| resultPath | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | See https://lodash.com/docs#get |
| [parse] | <code>function</code> | parse function that uses signature of fn(string, callback) with callback of fn(err, result) |

<a name="PRTG+getSensor"></a>
### prtg.getSensor(objid) ⇒ <code>\*</code> &#124; <code>promise</code> &#124; <code>[Sensor](#Sensor)</code>
**Kind**: instance method of <code>[PRTG](#PRTG)</code>  

| Param | Description |
| --- | --- |
| objid | sensor's ID |

<a name="PRTG+getDeviceSensors"></a>
### prtg.getDeviceSensors(objid, [columns]) ⇒ <code>\*</code> &#124; <code>promise</code> &#124; <code>[Array.&lt;Sensor&gt;](#Sensor)</code>
**Kind**: instance method of <code>[PRTG](#PRTG)</code>  

| Param | Type | Description |
| --- | --- | --- |
| objid |  |  |
| [columns] | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | Defaults to 'objid,probe,group,device,sensor,lastvalue,type,name,tags,active,status,grpdev,message' |

<a name="PRTG+getObjectProperty"></a>
### prtg.getObjectProperty(objid, property) ⇒ <code>promise</code> &#124; <code>Object</code>
**Kind**: instance method of <code>[PRTG](#PRTG)</code>  

| Param |
| --- |
| objid | 
| property | 

<a name="PRTG+getSensorStatusId"></a>
### prtg.getSensorStatusId(objid) ⇒ <code>\*</code> &#124; <code>promise</code> &#124; <code>string</code>
**Kind**: instance method of <code>[PRTG](#PRTG)</code>  

| Param |
| --- |
| objid | 

<a name="Sensor"></a>
## Sensor : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| name | <code>string</code> | 
| sensortype | <code>string</code> | 
| interval | <code>string</code> | 
| probename | <code>string</code> | 
| probegroupname | <code>string</code> | 
| parentdevicename | <code>string</code> | 
| parentdeviceid | <code>string</code> | 
| lastvalue | <code>string</code> | 
| lastmessage | <code>string</code> | 
| favorite | <code>string</code> | 
| statustext | <code>string</code> | 
| statusid | <code>string</code> | 
| lastup | <code>string</code> | 
| lastdown | <code>string</code> | 
| lastcheck | <code>string</code> | 
| uptime | <code>string</code> | 
| uptimetime | <code>string</code> | 
| downtime | <code>string</code> | 
| downtimetime | <code>string</code> | 
| updowntotal | <code>string</code> | 
| updownsince | <code>string</code> | 

<a name="SensorColumns"></a>
## SensorColumns : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| objid | <code>number</code> |  |
| type | <code>string</code> |  |
| name | <code>string</code> |  |
| tags |  |  |
| active |  |  |
| downtime |  |  |
| downtimetime |  |  |
| downtimesince |  |  |
| uptime |  |  |
| uptimetime |  |  |
| uptimesince |  |  |
| knowntime |  |  |
| cumsince |  |  |
| sensor |  |  |
| interval |  |  |
| lastcheck |  |  |
| lastup |  |  |
| lastdown |  |  |
| device |  |  |
| group |  |  |
| probe |  |  |
| grpdev |  |  |
| notifiesx |  |  |
| intervalx |  |  |
| access |  |  |
| dependency |  |  |
| probegroupdevice |  |  |
| status |  |  |
| message |  |  |
| priority |  |  |
| lastvalue |  |  |
| upsens |  |  |
| downsens |  |  |
| partialdownsens |  |  |
| warnsens |  |  |
| pausedsens |  |  |
| unusualsens |  |  |
| undefinedsens |  |  |
| totalsens |  |  |
| favorite |  |  |
| minigraph |  |  |
| comments |  |  |
| basetype |  | ?? |
| baselink |  | ?? |
| parentid |  | ?? |

