const chai = require('chai');
const chaiHttp = require('chai-http');
const webserver = require('../src/webserver');
const testingData = require('./data');

const expect = chai.expect;

chai.use(chaiHttp);

// Variables which would change and be useful in the tests going ahead.
let server = null, token = null, taskId = null;

describe('Testing TaskMaster\'s API Endpoints', () => {

    before(async function () {
        server = await webserver.initialize();
    });

    describe('POST /api/user/register', () => {
        it('should register a user with valid data', (done) => {
            chai.request(server)
                .post('/api/user/register')
                .send(testingData.user)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.response).to.be.an('object');
                    expect(res.body.response.user).to.be.an('object');
                    expect(res.body.response.user.fullname).to.be.equal(testingData.user.fullname);
                    done();
                });
        });

        it('should return validation error for invalid data', (done) => {
            chai.request(server)
                .post('/api/user/register')
                .send({
                    username: 'usr',
                    fullname: 'Name',
                    email: 'invalidemail',
                    password: 'pwd'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body.response).to.be.an('array');
                    done();
                });
        });

        it('should signin the existing user', (done) => {
            chai.request(server)
                .post('/api/auth/signin')
                .send(testingData.user)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.response).to.be.an('object');
                    expect(res.body.response.user).to.be.an('object');
                    expect(res.body.response.token).to.be.an('string');

                    token = res.body.response.token;

                    done();
                });
        });

        it('should return error for invalid credentials', (done) => {
            chai.request(server)
                .post('/api/auth/signin')
                .send({
                    username: testingData.user.username,
                    password: 'invalidPassword'
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });

    describe('Validating the User endpoints', () => {
        describe('GET /api/user', () => {
            it('should return user data', (done) => {
                chai.request(server)
                    .get('/api/user')
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.response).to.be.an('object');
                        expect(res.body.response.fullname).to.be.equal(testingData.user.fullname);
                        done();
                    });
            });
        });
    
        describe('PUT /api/user', () => {
            it('should update the fullname', (done) => {
                chai.request(server)
                    .put('/api/user')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ fullname: testingData.user.fullname + ' Updated' })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
    
                        done();
                    });
            });
        });
    });

    describe('POST /api/task', () => {
        it('should create a new task with valid data', (done) => {

            chai.request(server)
                .post('/api/task')
                .set('Authorization', `Bearer ${token}`)
                .send(testingData.task)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.response).to.be.an('object');
                    expect(res.body.response.task).to.be.an('object');

                    done();
                });
        });

        it('should return validation error for invalid data', (done) => {
            chai.request(server)
                .post('/api/task')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: '-',
                    description: '-',
                    status: 'Invalid Status',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');

                    done();
                });
        });
    });

    describe('GET /api/task', () => {
        it('should return tasks with pagination info', (done) => {
            chai.request(server)
                .get('/api/task')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.response).to.be.an('object');
                    expect(res.body.response.tasks).to.be.an('array');
                    expect(res.body.response).to.have.property('totalPages');
                    expect(res.body.response).to.have.property('nextPage');
                    expect(res.body.response).to.have.property('currentPage');

                    if (res.body.response.tasks.length) {
                        let {tasks} = res.body.response;
                        taskId = tasks[0]['_id'];
                    }

                    done();
                });
        });
    });

    describe('PUT /api/task/:id', () => {
        it('should update the task status', (done) => {
            chai.request(server)
                .put(`/api/task/${taskId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ status: 'In Progress' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.response).to.be.an('object');

                    done();
                });
        });
    });

    describe('DELETE /api/task/:id', () => {
        it('should delete a task by id', (done) => {
            chai.request(server)
                .delete(`/api/task/${taskId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});
