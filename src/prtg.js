/**
 * Created by kgrube on 1/5/2016.
 */

/**
 * @private
 */
const request = require('request');
const _ = require('lodash');
const xml2js = require('xml2js').parseString;

/**
 * @typedef {object} PRTGFilter
 * @property {string} [filter_drel]         Only include records younger than this setting (for content='messages' and content='tickets' only).
 *                                          Possible values: today, yesterday, 7days, 30days, 12months, forever
 *
 * @property {string[]|string} [filter_status]    Only include sensors with a specific status (for content='sensors' only). Using multiple filter_status fields performs a logical OR.
 *                              See types PRTG.DEFAULTS.status.
 *
 * @property {string[]|string} [filter_tags]       Only include sensors with a specific tag (for content="sensors" only).
 *                                          Using multiple filter_tag fields performs a logical OR.
 *                                          Possible values: @tag(tagname)
 *
 * @property {string|string[]} [filter_xyz] filter_xyz where xyz is any column name used in the columns parameter;
 *                                          Substrings: use filter_xyz=@sub(substring1,substring2);
 *                                          Values not equal/above/below: use filter_xyz=@neq(value), filter_xyz=@above(value), filter_xyz=@below(value)
 *
 * @property {string} [sortby]              Sorts the data.  If this parameter is omitted, the table will be sorted based on the first column.  Add a leading '-' to reverse.
 *                                          Possible values: any column name used in the columns parameter.  (sortby=name, sortby=lastvalue, sortby=-lastvalue)
 */

/**
 * @typedef {object} Sensor
 * @property {string} name
 * @property {string} sensortype
 * @property {string} interval
 * @property {string} probename
 * @property {string} probegroupname
 * @property {string} parentdevicename
 * @property {string} parentdeviceid
 * @property {string} lastvalue
 * @property {string} lastmessage
 * @property {string} favorite
 * @property {string} statustext
 * @property {string} statusid
 * @property {string} lastup
 * @property {string} lastdown
 * @property {string} lastcheck
 * @property {string} uptime
 * @property {string} uptimetime
 * @property {string} downtime
 * @property {string} downtimetime
 * @property {string} updowntotal
 * @property {string} updownsince
 */

/**
 * @typedef {object} SensorColumns
 * @property {number} objid
 * @property {string} type
 * @property {string} name
 * @property tags
 * @property active
 * @property downtime
 * @property downtimetime
 * @property downtimesince
 * @property uptime
 * @property uptimetime
 * @property uptimesince
 * @property knowntime
 * @property cumsince
 * @property sensor
 * @property interval
 * @property lastcheck
 * @property lastup
 * @property lastdown
 * @property device
 * @property group
 * @property probe
 * @property grpdev
 * @property notifiesx
 * @property intervalx
 * @property access
 * @property dependency
 * @property probegroupdevice
 * @property status
 * @property message
 * @property priority
 * @property lastvalue
 * @property upsens
 * @property downsens
 * @property partialdownsens
 * @property warnsens
 * @property pausedsens
 * @property unusualsens
 * @property undefinedsens
 * @property totalsens
 * @property favorite
 * @property minigraph
 * @property comments
 * @property basetype ??
 * @property baselink ??
 * @property parentid ??
 *
 */

/**
 *
 * @param options
 * @param options.username
 * @param options.passhash
 * @param options.url Base URL of your PRTG installation, e.g. the API is accessible at <url>/API/
 * @constructor
 */
function PRTG(options) {
  if (!options) {
    throw 'options must be defined';
  }

  if (!options.username) {
    throw 'options.username must be defined';
  }

  if (!options.passhash) {
    throw 'options.passhash must be defined';
  }

  if (!options.url) {
    throw 'options.url must be defined';
  }

  if (!options.debug) {
    this.debug = false;
  } else {
    this.debug = true;
  }

  this.auth = {username: options.username, passhash: options.passhash};
  this.url = options.url;

  this.DEFAULTS = {};

  //PRTG uses different notations for these IDs all over the place
  this.DEFAULTS.status = {};
  this.DEFAULTS.status['1'] = 'Unknown';
  this.DEFAULTS.status['2'] = 'Scanning';
  this.DEFAULTS.status['3'] = 'Up';
  this.DEFAULTS.status['4'] = 'Warning';
  this.DEFAULTS.status['5'] = 'Down';
  this.DEFAULTS.status['6'] = 'No Probe';
  this.DEFAULTS.status['7'] = 'Paused by User';
  this.DEFAULTS.status['8'] = 'Paused by Dependency';
  this.DEFAULTS.status['9'] = 'Paused by Schedule';
  this.DEFAULTS.status['10'] = 'Unusual';
  this.DEFAULTS.status['11'] = 'Not Licensed';
  this.DEFAULTS.status['12'] = 'Paused Until';
  this.DEFAULTS.status['13'] = 'Down (Acknowledged)';
  this.DEFAULTS.status['14'] = 'Down (Partial)';
  this.DEFAULTS.status['Unknown'] = '1';
  this.DEFAULTS.status['Scanning'] = '2';
  this.DEFAULTS.status['Collecting'] = '2';
  this.DEFAULTS.status['Up'] = '3';
  this.DEFAULTS.status['Warning'] = '4';
  this.DEFAULTS.status['Down'] = '5';
  this.DEFAULTS.status['No Probe'] = '6';
  this.DEFAULTS.status['Paused by User'] = '7';
  this.DEFAULTS.status['PausedbyUser'] = '7';
  this.DEFAULTS.status['Paused by Dependency'] = '8';
  this.DEFAULTS.status['PausedbyDependency'] = '8';
  this.DEFAULTS.status['Paused by Schedule'] = '9';
  this.DEFAULTS.status['PausedbySchedule'] = '9';
  this.DEFAULTS.status['Unusual'] = '10';
  this.DEFAULTS.status['Not Licensed'] = '11';
  this.DEFAULTS.status['PausedbyLicense'] = '11';
  this.DEFAULTS.status['Paused Until'] = '12';
  this.DEFAULTS.status['PausedUntil'] = '12';
  this.DEFAULTS.status['Down (Acknowledged)'] = '13';
  this.DEFAULTS.status['DownAcknowledged'] = '13';
  this.DEFAULTS.status['Down (Partial)'] = '14';
  this.DEFAULTS.status['DownPartial'] = '14';

  this.DEFAULTS.httpCodes = {};
  this.DEFAULTS.httpCodes[200] = 'OK';
  this.DEFAULTS.httpCodes[302] = 'Found';
  this.DEFAULTS.httpCodes[400] = 'Bad Request';
  this.DEFAULTS.httpCodes[401] = 'Unauthorized';

}

/**
 *
 * @returns {{}|*}
 */
PRTG.prototype.getDefaults = function () {
  return this.DEFAULTS;
};

/**
 * Return opposite mapping for status to status id
 * @param str
 * @returns {string|number}
 */
PRTG.prototype.getStatus = function (str) {
  return this.DEFAULTS.status[str];
};

/**
 *
 * @param {string} path
 * @param {object} query
 * @param {string|string[]} [resultPath] See https://lodash.com/docs#get
 * @param {function} [parse] parse function that uses signature of fn(string, callback) with callback of fn(err, result)
 * @param {boolean} [enableSanitize] enable regex to replace invalid characters
 * @returns {Promise|object}
 */
PRTG.prototype.api = function ({path, query = {}, resultPath = null, parse = null, enableSanitize = false}) {
  var self = this;

  var options = {
    url: this.url + path + parameterizeURL(Object.assign(query, this.auth)),
  };

  return new Promise((resolve, reject) => {
    return request(options, function (err, res, data) {
      if (err) {
        return reject(err);
      } else if (res.statusCode !== 200) {
        if (self.debug) {
          console.log('Status code:' + res.statusCode, 'Result: ' + JSON.stringify(res));
        }
        return reject('Error: ' + self.getDefaults().httpCodes[res.statusCode]);
      } else if (res.statusCode === 200) {

        var failParse = false;

        // try to parse without sanitizing, fallback to sanitizing JSON expected data
        try {
          if (!parse) {
            JSON.parse(data);
          }
        } catch (e) {
          failParse = true;
        }

        if (enableSanitize || failParse) {
          //API returns improperly escaped JSON sometimes, escape it with regex
          data = data.replace(/\s(?=([^"]*"[^"]*")*[^"]*$)/g, '')
            .replace(/\\/g, '\\\\')
            .replace('/\//g', '\\/');
        }

        try {
          if (!parse && resultPath) {
            return resolve(_.get(JSON.parse(data), resultPath));
          } else if (!parse) {
            return resolve(JSON.parse(data));
          } else {
            return parse(data, function (err, res) {
              if (!err) {
                if (resultPath) {
                  return resolve(_.get(res, resultPath));
                }
                return resolve(res);
              } else {
                return reject(err);
              }
            });
          }
        } catch (e) {
          return reject(e);
        }
      }
    });
  });
};

/**
 *
 * @param objid sensor's ID
 * @returns {Promise<Sensor>}
 */
PRTG.prototype.getSensor = function (objid) {
  return this.api({path: '/api/getsensordetails.json', query: {id: objid}, resultPath: 'sensordata'});
};

/**
 *
 * @param objid
 * @param {string|string[]} [columns] Defaults to 'objid,probe,group,device,sensor,lastvalue,type,name,tags,active,status,grpdev,message'
 * @returns {Promise<Sensor[]>}
 */
PRTG.prototype.getDeviceSensors = function (objid, columns) {
  var path = '/api/table.json';
  var query = {content: 'sensors', output: 'json'};

  if (columns) {
    if (_.isArray(columns)) {
      columns = columns.join(',');
    }
  } else {
    columns = 'objid,probe,group,device,sensor,lastvalue,type,name,tags,active,status,grpdev,message';
  }
  query.columns = columns;

  if (objid) {
    query.id = objid;
  }

  return this.api({path, query, resultPath: 'sensors'});
};

/**
 *
 * @param objid
 * @param property
 * @returns {Promise<Object>}
 */
PRTG.prototype.getObjectProperty = function (objid, property) {
  return this.api({
    path: '/api/getobjectstatus.htm',
    query: {
      id: objid,
      name: property,
      show: 'text',
    },
    resultPath: 'prtg.result',
    parse: parseXML,
  });
};

/**
 *
 * @param objid
 * @returns {Promise<String>}
 */
PRTG.prototype.getSensorStatusId = function (objid) {
  return this.getSensor(objid)
    .then((res) => res.statusid);
};

/**
 * @param objid
 * @returns {Promise<String>}
 */
PRTG.prototype.getDeviceStatusId = function (objid) {
  return this.getSensorStatusId(objid);
};

/**
 * @param [columns]
 * @param {PRTGFilter} [filter]
 * @param {string|number} [objid] filter set to this object (device/group/probe)
 * @returns {Promise<Sensor[]>}
 */
PRTG.prototype.getSensors = function (columns, filter, objid) {
  var path = '/api/table.json';
  var query = {content: 'sensors'};

  if (columns) {
    if (_.isArray(columns)) {
      columns = columns.join(',');
    }
  } else {
    columns = 'objid,probe,group,device,sensor,lastvalue,type,name,tags,active,status,grpdev,message';
  }

  query.columns = columns;

  if (filter) {
    query = Object.assign(query, filter);
  }

  if (objid) {
    query.id = objid;
  }

  return this.api({path, query, resultPath: 'sensors'});
};

/**
 *
 * @returns {Promise<Sensor[]>}
 */
PRTG.prototype.getDownOrAckSensors = function () {
  return this.getSensors(null, {filter_status: [this.DEFAULTS.status['Down'], this.DEFAULTS.status['DownAcknowledged']]});
};

/**
 *
 * @returns {Promise<Object>}
 */
PRTG.prototype.getSensorTree = function () {
  const path = '/api/table.xml';
  const query = {content: 'sensortree', output: 'xml', count: 50000};

  return this.api({
    path,
    query,
    resultPath: 'prtg.sensortree.nodes.group',
    parse: parseXML,
  });
};

PRTG.prototype.simulateSensorError = function (objectId) {
  const path = `/api/simulate.htm`;

  return this.api({
    path,
    query: {id: objectId, action: 1},
    parse: (_, cb) => cb(null, {}),
  });
};

/**
 * @param objectId
 * @param message
 * @returns {Promise|Object}
 */
PRTG.prototype.pauseSensor = function (objectId, message = '') {
  const path = `/api/pause.htm`;

  return this.api({
    path,
    query: {id: objectId, pausemsg: message, action: 0},
    parse: (_, cb) => cb(null, {}),
  });
};

/**
 * @param objectId
 * @returns {Promise|Object}
 */
PRTG.prototype.resumeSensor = function (objectId) {
  const path = `/api/pause.htm`;

  return this.api({
    path,
    query: {id: objectId, action: 1},
    parse: (_, cb) => cb(null, {}),
  });
};

/**
 * @param objectId
 * @param message
 * @param minutes
 * @returns {Promise|Object}
 */
PRTG.prototype.pauseSensorDuration = function (objectId, message, minutes) {
  const path = `/api/pauseobjectfor.htm`;

  return this.api({
    path,
    query: {id: objectId, pausemsg: message, duration: minutes},
    parse: (_, cb) => cb(null, {}),
  });
};

/**
 * @param objectId
 * @param message
 * @returns {Promise|Object}
 */
PRTG.prototype.acknowledgeSensor = function (objectId, message) {
  const path = `/api/acknowledgealarm.htm`;

  return this.api({
    path,
    query: {id: objectId, ackmsg: message},
    parse: (_, cb) => cb(null, {}),
  });
};

/**
 * @param objectId
 * @param message
 * @param minutes
 * @returns {Promise|Object}
 */
PRTG.prototype.acknowledgeSensorDuration = function (objectId, message, minutes) {
  const path = `/api/acknowledgealarm.htm`;

  return this.api({
    path,
    query: {id: objectId, ackmsg: message, duration: minutes},
    parse: (_, cb) => cb(null, {}),
  });
};


/**
 *
 * @private
 * @param {string} str xml string to parse
 * @param {function} cb callback(err, res)
 */
function parseXML(str, cb) {
  xml2js(str, {
    emptyTag: null,
    ignoreAttrs: true,
    mergeAttrs: true,
    explicitArray: false,
    trim: true,
  }, cb);
}

// /**
//  *
//  * @param {PRTGFilter} filter
//  * @returns {string}
//  */
// function parameterize(filter) {
//   var params = [];
//
//   for (var f in filter) {
//     if (filter.hasOwnProperty(f)) {
//       if (_.isArray(filter[f])) {
//         for (var i = 0; i < filter[f].length; i++) {
//           params.push(f + '=' + filter[f][i]);
//         }
//       } else {
//         params.push(f + '=' + filter[f]);
//       }
//     }
//   }
//
//   return '&' + params.join('&');
// }

/**
 * Create a parameterized string for GET requests.
 * Able to use contains, like, etc
 * Example params object: { id: 1234, message: 'Test message ? and #' }
 * Returns: ?id=1234&message=
 * @private
 * @param {object|string} params
 * @returns {string}
 */
function parameterizeURL(params) {
  if (typeof params === 'string') {
    return params;
  }

  var result = [];
  for (var param in params) {
    if (params.hasOwnProperty(param)) {
      if (_.isArray(params[param])) {
        params[param].forEach(el => result.push(param + '=' + encodeURIComponent(el)));
      } else {
        result.push(param + '=' + encodeURIComponent(params[param]));
      }
    }
  }

  return '?' + result.join('&');
}

module.exports = PRTG;
