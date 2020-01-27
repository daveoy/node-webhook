const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { spawnSync } = require('child_process');
const PORT = process.env.PORT || 4000
const webhookRouter = express.Router();
GITLAB_CHI_ALLOWED = ['refs/heads/mill3d_ws','refs/heads/mill3d_rb','refs/heads/mill2d_ws','refs/heads/mill2d_rb']
GITLAB_SYSTEMS_ALLOWED = ['refs/heads/windows']
app.use(morgan());
app.use(cors());
app.use(bodyParser.json());

const deployEnvironment = async (environment) => {
  const envname = environment.split("/").slice(-1)
  const cmd = `/usr/local/bin/r10k`
  const args = ["-c","/r10k.yaml","deploy","environment",envname,"--puppetfile"]
  console.log(cmd, args)
  let child = spawnSync(cmd, args)
  console.log('deploy output:')
  console.log(child.output.toString())
  console.log('deploy error:')
  console.log(child.error.toString())
  let status = child.stdout.toString().trim()
  return status
}

webhookRouter.post('/', async (req,res,next) => {
  console.log(req.body)
  if (req.body.project.web_url == 'http://gitlab.chi.themill.com/puppet/global'){
    if (GITLAB_CHI_ALLOWED.includes(req.body.ref)){
      const deploymentstatus = await deployEnvironment(req.body.ref)
      console.log(deploymentstatus)
    } else {
      console.log(`${req.body.ref} not in GITLAB_CHI_ALLOWED`)
    }
  } else if (req.body.project.web_url == 'http://gitlab-systems.themill.com/puppet-ldn/puppet-general'){
    if (GITLAB_SYSTEMS_ALLOWED.includes(req.body.ref)){
      const deploymentstatus = await deployEnvironment(req.body.ref)
      console.log(deploymentstatus)
    } else {
      console.log(`${req.body.ref} not in GITLAB_SYSTEMS_ALLOWED`)
    }
  }
	res.status(200).send({status:'ok'});
});
app.use('/',webhookRouter);
// establish our mysql connex
app.listen(PORT);