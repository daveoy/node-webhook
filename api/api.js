const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { spawnSync } = require('child_process');
const PORT = process.env.PORT || 4000
const webhookRouter = express.Router();
GIT_ALLOWED = ['refs/heads/windows','refs/heads/global_classes','refs/heads/global_classes_tcs','refs/heads/tcs','refs/heads/millsite_local','refs/heads/mill3d','refs/heads/mill2d','refs/heads/servers']
//GITLAB_SYSTEMS_ALLOWED = ['refs/heads/master']
app.use(morgan());
app.use(cors());
app.use(bodyParser.json());

const deployEnvironment = async (environment) => {
  const envname = environment.split("/").slice(-1)[0]
  if (envname == 'master' && process.env.REACT_APP_MILL_SITE != 'ldn'){
    console.log('not deploying master since im not in london')
    return true
  }
  const cmd = `/usr/local/bin/r10k`
  const args = ["-c","/r10k.yaml","deploy","environment"]
  if(envname != 'millsite_local' && envname != 'global_classes' && envname != 'global_classes_tcs'){
    args.push(envname)
  }
  args.push('--puppetfile')
  console.log(cmd, args)
  let child = spawnSync(cmd, args)
  if (child.error){
    console.log('deploy error:')
    console.log(child.error.toString())
  }
}

webhookRouter.post('/', async (req,res,next) => {
  console.log(`incoming update from ${req.body.project.web_url} by ${req.body.user_name} to ${req.body.ref}`)
  if (req.body.project.web_url.includes('git.themill.com/puppet/')){
    if (GIT_ALLOWED.includes(req.body.ref)){
      const deploymentstatus = await deployEnvironment(req.body.ref)
    } else {
      console.log(`${req.body.ref} not in GIT_ALLOWED`)
    }
//  } else if (req.body.project.web_url.includes('gitlab-systems.themill.com/puppet-ldn/')){
//    if (GITLAB_SYSTEMS_ALLOWED.includes(req.body.ref)){
//      const deploymentstatus = await deployEnvironment(req.body.ref)
//    } else {
//      console.log(`${req.body.ref} not in GITLAB_SYSTEMS_ALLOWED`)
//    }
  }
	res.status(200).send({status:'ok'});
});
app.use('/',webhookRouter);
// establish our mysql connex
app.listen(PORT);
