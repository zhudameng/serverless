'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const path = require('path');
const AwsInvokeLocal = require('./index');
const AwsProvider = require('../provider/awsProvider');
const Serverless = require('../../../Serverless');
const BbPromise = require('bluebird');
const testUtils = require('../../../../tests/utils');

describe('AwsInvokeLocal', () => {
  const serverless = new Serverless();
  serverless.setProvider('aws', new AwsProvider(serverless));
  const options = {
    stage: 'dev',
    region: 'us-east-1',
    function: 'first',
  };
  const awsInvokeLocal = new AwsInvokeLocal(serverless, options);

  describe('#constructor()', () => {
    it('should have hooks', () => expect(awsInvokeLocal.hooks).to.be.not.empty);

    it('should set the provider variable to an instance of AwsProvider', () =>
      expect(awsInvokeLocal.provider).to.be.instanceof(AwsProvider));

    it('should run promise chain in order', () => {
      const validateStub = sinon
        .stub(awsInvokeLocal, 'extendedValidate').returns(BbPromise.resolve());
      const loadEnvVarsStub = sinon
        .stub(awsInvokeLocal, 'loadEnvVars').returns(BbPromise.resolve());
      const invokeLocalStub = sinon
        .stub(awsInvokeLocal, 'invokeLocal').returns(BbPromise.resolve());


      return awsInvokeLocal.hooks['invoke:local:invoke']().then(() => {
        expect(validateStub.calledOnce).to.be.equal(true);
        expect(loadEnvVarsStub.calledAfter(validateStub)).to.be.equal(true);
        expect(invokeLocalStub.calledAfter(loadEnvVarsStub)).to.be.equal(true);

        awsInvokeLocal.extendedValidate.restore();
        awsInvokeLocal.loadEnvVars.restore();
        awsInvokeLocal.invokeLocal.restore();
      });
    });

    it('should set an empty options object if no options are given', () => {
      const awsInvokeWithEmptyOptions = new AwsInvokeLocal(serverless);

      expect(awsInvokeWithEmptyOptions.options).to.deep.equal({});
    });
  });

  describe('#extendedValidate()', () => {
    beforeEach(() => {
      serverless.config.servicePath = true;
      serverless.service.environment = {
        vars: {},
        stages: {
          dev: {
            vars: {},
            regions: {
              'us-east-1': {
                vars: {},
              },
            },
          },
        },
      };
      serverless.service.functions = {
        first: {
          handler: true,
        },
      };
    });

    it('it should throw error if function is not provided', () => {
      serverless.service.functions = null;
      expect(() => awsInvokeLocal.extendedValidate()).to.throw(Error);
    });

    it('should sanitize data if it is provided via CLI', () => {
      awsInvokeLocal.options.data = '{ "key1" : "pwd" }';

      const parsedData = {
        key1: 'pwd',
      };

      return awsInvokeLocal.extendedValidate().then(() => {
        expect(awsInvokeLocal.options.data).to.deep.equal(parsedData);
      });
    });

    it('it should parse mock file if provided', () => {
      serverless.config.servicePath = testUtils.getTmpDirPath();
      const data = {
        event: {
          testProp: 'testValue',
        },
      };
      serverless.utils.writeFileSync(path
        .join(serverless.config.servicePath, 'data.json'), JSON.stringify(data));
      awsInvokeLocal.options.path = 'data.json';

      return awsInvokeLocal.extendedValidate().then(() => {
        expect(awsInvokeLocal.options.data).to.deep.equal(data);
        awsInvokeLocal.options.path = false;
        serverless.config.servicePath = true;
      });
    });

    it('it should parse file if absolute file path is provided', () => {
      serverless.config.servicePath = testUtils.getTmpDirPath();
      const data = {
        event: {
          testProp: 'testValue',
        },
      };
      const dataFile = path.join(serverless.config.servicePath, 'data.json');
      serverless.utils.writeFileSync(dataFile, JSON.stringify(data));
      awsInvokeLocal.options.path = dataFile;

      return awsInvokeLocal.extendedValidate().then(() => {
        expect(awsInvokeLocal.options.data).to.deep.equal(data);
        awsInvokeLocal.options.path = false;
        serverless.config.servicePath = true;
      });
    });

    it('it should parse a yaml file if file path is provided', () => {
      serverless.config.servicePath = testUtils.getTmpDirPath();
      const yamlContent = 'event: data';

      serverless.utils.writeFileSync(path
          .join(serverless.config.servicePath, 'data.yml'), yamlContent);
      awsInvokeLocal.options.path = 'data.yml';

      return awsInvokeLocal.extendedValidate().then(() => {
        expect(awsInvokeLocal.options.data).to.deep.equal({ event: 'data' });
        awsInvokeLocal.options.path = false;
        serverless.config.servicePath = true;
      });
    });

    it('it should throw error if service path is not set', () => {
      serverless.config.servicePath = false;
      expect(() => awsInvokeLocal.extendedValidate()).to.throw(Error);
      serverless.config.servicePath = true;
    });

    it('it should throw error if file path does not exist', () => {
      serverless.config.servicePath = testUtils.getTmpDirPath();
      awsInvokeLocal.options.path = 'some/path';

      expect(() => awsInvokeLocal.extendedValidate()).to.throw(Error);

      awsInvokeLocal.options.path = false;
      serverless.config.servicePath = true;
    });

    it('should resolve if path is not given', (done) => {
      awsInvokeLocal.options.path = false;

      awsInvokeLocal.extendedValidate().then(() => done());
    });
  });

  describe('#loadEnvVars()', () => {
    beforeEach(() => {
      serverless.config.servicePath = true;
      serverless.service.provider = {
        environment: {
          providerVar: 'providerValue',
        },
      };

      awsInvokeLocal.options = {
        functionObj: {
          environment: {
            functionVar: 'functionValue',
          },
        },
      };
    });

    it('it should load provider env vars', () => awsInvokeLocal
      .loadEnvVars().then(() => {
        expect(process.env.providerVar).to.be.equal('providerValue');
      })
    );

    it('it should load function env vars', () => awsInvokeLocal
      .loadEnvVars().then(() => {
        expect(process.env.functionVar).to.be.equal('functionValue');
      })
    );

    it('it should overwrite provider env vars', () => {
      awsInvokeLocal.options.functionObj.environment.providerVar = 'providerValueOverwritten';
      return awsInvokeLocal.loadEnvVars().then(() => {
        expect(process.env.providerVar).to.be.equal('providerValueOverwritten');
      });
    });
  });

  describe('#invokeLocal()', () => {
    const invokeLocalNodeJsStub = sinon
      .stub(awsInvokeLocal, 'invokeLocalNodeJs').returns(BbPromise.resolve());
    beforeEach(() => {
      awsInvokeLocal.serverless.service.service = 'new-service';
      awsInvokeLocal.options = {
        stage: 'dev',
        function: 'first',
        functionObj: {
          handler: 'handler.hello',
          name: 'hello',
        },
        data: {},
      };
    });

    it('should call invokeLocalNodeJs when no runtime is set', () => awsInvokeLocal.invokeLocal()
      .then(() => {
        expect(invokeLocalNodeJsStub.calledOnce).to.be.equal(true);
        expect(invokeLocalNodeJsStub.calledWithExactly(
          'handler',
          'hello',
          {}
        )).to.be.equal(true);
        awsInvokeLocal.invokeLocalNodeJs.restore();
      })
    );

    it('throw error when using runtime other than Node.js', () => {
      awsInvokeLocal.options.functionObj.runtime = 'python';
      expect(() => awsInvokeLocal.invokeLocal()).to.throw(Error);
      delete awsInvokeLocal.options.functionObj.runtime;
    });
  });
});
