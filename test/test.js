/**
 * Created by kgrube on 9/5/2018
 */
require('dotenv').config({path: require('path').join(__dirname, '.env.test')});
const assert = require('assert');
const _ = require('lodash');
const PRTG = require('../src/prtg');
const should = require('should');
const mocha = require('mocha');
const {describe} = mocha;

const parsed = {
  URL: process.env.URL,
  USER: process.env.API_USER,
  PASSHASH: process.env.PASSHASH,
  DEVICE_ID: process.env.DEVICE_ID,
  SENSOR_ID: process.env.SENSOR_ID,
};

const prtg = new PRTG({
  'url': parsed.URL,
  'username': parsed.USER,
  'passhash': parsed.PASSHASH,
});

describe('PRTG', () => {
  describe('instance', () => {
    it('should be an instance of PRTG', done => {
      assert(prtg instanceof PRTG);
      done();
    });

    describe('should throw an error', () => {
      it('when options is not defined', done => {
        try {
          const p = new PRTG();
        } catch (err) {
          if (err === 'options must be defined') {
            done();
            return;
          }
        }
        done(new Error('options not defined error was not thrown'));
      });

      it('when url is not defined', done => {
        try {
          const p = new PRTG({username: 'blank', passhash: 'blank'});
        } catch (err) {
          if (err === 'options.url must be defined') {
            done();
            return;
          }
        }
        done(new Error('url not defined error was not thrown'));
      });

      it('when username is not defined', done => {
        try {
          const p = new PRTG({passhash: 'blank', url: 'blank'});
        } catch (err) {
          if (err === 'options.username must be defined') {
            done();
            return;
          }
        }
        done(new Error('username not defined error was not thrown'));
      });

      it('when passhash is not defined', done => {
        try {
          const p = new PRTG({username: 'blank', url: 'blank'});
        } catch (err) {
          if (err === 'options.passhash must be defined') {
            done();
            return;
          }
        }
        done(new Error('passhash not defined error was not thrown'));
      });
    });
  });

  describe('#getDefaults()', () => {
    it('should return an object', done => {
      assert(typeof prtg.getDefaults() === 'object');
      done();
    });
    it('should contain httpCodes', done => {
      assert(prtg.getDefaults().httpCodes);
      done();
    });
    it('should contain status', done => {
      assert(prtg.getDefaults().status);
      done();
    });
    it('should contain status Up', done => {
      assert(prtg.getDefaults().status['Up'] === '3');
      done();
    });
    it('should contain status id 3', done => {
      assert(prtg.getDefaults().status['3'] === 'Up');
      done();
    });
  });

  describe('#getStatus()', () => {
    it('should return status Up for id 3', done => {
      assert(prtg.getStatus('Up') === '3');
      done();
    });
  });

  describe('#getSensor()', () => {
    it('should return a sensor object', done => {
      prtg.getSensor(parsed.SENSOR_ID)
        .then(sensor => {
          assertSensor(sensor);
          done();
        })
        .catch(err => {
          done(new Error(err));
        });
    });
  });

  describe('#getDeviceSensors', () => {
    it('should return an array of sensors', done => {
      const columns = ['objid', 'probe', 'group', 'device', 'sensor', 'lastvalue', 'type', 'name', 'tags', 'active', 'status', 'grpdev', 'message'];
      prtg.getDeviceSensors(parsed.DEVICE_ID, columns)
        .then(sensors => {
          assert(_.isArray(sensors));
          return sensors;
        })
        .then(sensors => {
          sensors.forEach(sensor => {
            assertSensor(sensor);
          });
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });

  describe('#getObjectProperty', () => {
    it('should return the same objid', done => {
      prtg.getObjectProperty(parsed.SENSOR_ID, 'objid')
        .then(property => {
          assert(property === parsed.SENSOR_ID);
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });

  describe('#getSensorStatusId', () => {
    it('should return a valid status id', done => {
      prtg.getSensorStatusId(parsed.SENSOR_ID)
        .then(statusId => {
          assert(statusId > 0 && statusId <= 14);
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });

  describe('#getDeviceStausId', () => {
    it('should return a valid status id', done => {
      prtg.getDeviceStatusId(parsed.DEVICE_ID)
        .then(statusId => {
          assert(statusId > 0 && statusId <= 14);
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });

  describe('#getSensors', () => {
    it('should return an array of sensors with no params', done => {
      prtg.getSensors()
        .then(sensors => {
          assert(_.isArray(sensors));
          return sensors;
        })
        .then(sensors => {
          sensors.forEach(sensor => {
            assertSensor(sensor);
          });
          done();
        })
        .catch(err => done(new Error(err)));
    });

    it('should return an array of sensors when filtered', done => {
      const columns = ['objid', 'probe', 'group', 'device', 'sensor', 'lastvalue', 'type', 'name', 'tags', 'active', 'status', 'grpdev', 'message'];
      const filter = {filter_status: [prtg.getDefaults().status['Down'], prtg.getDefaults().status['DownAcknowledged']]};

      prtg.getSensors(columns, filter, parsed.DEVICE_ID)
        .then(sensors => {
          assert(_.isArray(sensors));
          return sensors;
        })
        .then(sensors => {
          sensors.forEach(sensor => {
            assertSensor(sensor);
          });
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });

  describe('#getDownOrAckSensors', () => {
    it('should return an array of sensors', done => {
      prtg.getDownOrAckSensors()
        .then(sensors => {
          assert(_.isArray(sensors));
          return sensors;
        })
        .then(sensors => {
          sensors.forEach(sensor => {
            assertSensor(sensor);
          });
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });

  describe('#getSensorTree', () => {
    it('should return ', done => {
      prtg.getSensorTree()
        .then(sensorTree => {
          assertGroup(sensorTree);
          done();
        })
        .catch(err => done(new Error(err)));
    }).timeout(10000);
  });

  describe('#simulateSensorError', () => {
    it('should return an empty object', done => {
      prtg.simulateSensorError(parsed.SENSOR_ID)
        .then(res => {
          assertEmpty(res);
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });

  describe('#pauseSensor', () => {
    it('should return an empty object', done => {
      prtg.pauseSensor(parsed.SENSOR_ID, 'Test Pause Sensor')
        .then(res => {
          assertEmpty(res);
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });

  describe('#pauseSensorDuration', () => {
    it('should return an empty object', done => {
      prtg.pauseSensorDuration(parsed.SENSOR_ID, 'Test Pause Sensor', 5)
        .then(res => {
          assertEmpty(res);
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });

  describe('#acknowledgeSensor', () => {
    it('should return an empty object', done => {
      prtg.acknowledgeSensor(parsed.SENSOR_ID, 'Test Acknowledge Sensor')
        .then(res => {
          assertEmpty(res);
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });

  describe('#acknowledgeSensorDuration', () => {
    it('should return an empty object', done => {
      prtg.acknowledgeSensorDuration(parsed.SENSOR_ID, 'Test Acknowledge Sensor', 5)
        .then(res => {
          assertEmpty(res);
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });

  describe('#resumeSensor', () => {
    it('should return an empty object', done => {
      prtg.resumeSensor(parsed.SENSOR_ID)
        .then(res => {
          assertEmpty(res);
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });
});

after(() => {
  prtg.resumeSensor(parsed.SENSOR_ID);
});


function assertSensor(sensor) {
  assert(sensor.name);
  assert(sensor.probename || sensor.probe);
  assert(sensor.statusid || sensor.status);
}

function assertGroup(group) {
  assert(group.name);
  assert(group.id === '0');
  assert(group.url);
  assert(_.isArray(group.probenode));
}

function assertEmpty(obj) {
  assert(Object.keys(obj).length === 0 && obj.constructor === Object);
}
