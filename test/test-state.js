var chai = require('chai');

var expect = chai.expect,
should = chai.should;

var ProtocolState = require('../lib/protocol-state.js');
var config = require('../lib/epp-config-devel.json')['nzrs-test1'];

describe('Communication protocol state machine', function() {
    var protocol, stateMachine;
    beforeEach(function() {
        stateMachine = new ProtocolState('nzrs-test1', config);
        var connection = stateMachine.connection;
        connection.send = function(xml, callback) {
            callback('<test></test>');
        };
    });
    it('should start out offline', function() {
        expect(stateMachine.state).to.equal('offline');
    });

    describe('registry account logged in', function() {

        beforeEach(function() {
            stateMachine.command('login', {
                "login": "test-user",
                "password": "123xyz"
            },
            'test-login-1234', function() {
                return {
                    "status": "OK"
                };
            });
        });
        it('should move into idle loop following successful login', function() {
            //expect(stateMachine.connected).to.equal(true);
            expect(stateMachine.state).to.equal('idle');

        });
        it('should throw an error if transactionId not present', function() {

            var testCrash = function() {
                stateMachine.command('logout', {},
                function() {
                    return {
                        "status": "OK"
                    };
                });
            };
            expect(testCrash).to.
            throw ('No transactionId provided');
        });
        it('should throw an error if callback not provided', function() {
            var testCrash = function () {
                stateMachine.command('dosesntMatter', {}, 'test-happiness');
            };
            expect(testCrash).to.throw('Return callback must be a function.');
        });
        it('should be disconnected after logging out', function() {
            stateMachine.command('logout', {},
            'test-logout-1234',
            function() {
                return {
                    "status": "OK"
                };
            });
        });
        it('should execute a specific command and then return to an idle state', function() {
            stateMachine.command('checkDomain', {
                "domain": "test-domain.com"
            },
            'test-checkDomain-1234', function() {
                return {
                    "status": "OK"
                };
            });
            expect(stateMachine.state).to.equal('idle');

        });
    });
});

