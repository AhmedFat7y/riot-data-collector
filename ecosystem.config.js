module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: "riot-data-collector",
      script: "index",
      node_args: "-r dotenv/config",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_staging: {
        NODE_ENV: "development",

      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    staging: {
      user: "enuma",
      host: "139.162.166.14",
      ref: "origin/master",
      repo: "git@github.com:AhmedFat7y/riot-data-collector.git",
      path: "/var/www/nodejs/riot-data-collector",
      "post-deploy": ". ~/.zshrc; npm install && pm2 startOrRestart ecosystem.config.js --env production"
    }
  }
};
