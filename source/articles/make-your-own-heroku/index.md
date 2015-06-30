---
title: Make your own Heroku
date: 2014-04-24
template: _templates/article.html
thumbnail: dokku-thumb.jpg
feature: dokku-feature.png
background: dokku.jpg
canvas: navy mesh
spot: cyan
description: Make a cheap, DIY Heroku and GitHub Pages clone with Dokku and DigitalOcean.
---

If you've ever used [GitHub Pages](https://pages.github.com/), you know how easy and convenient it is to be able to deploy a quick static site by pushing to a remote. Being able to type ```git push origin gh-pages``` and have your site immediately live on a publicly accessible domain is hugely satisfying and you end up experimenting way more, pushing up micro-sites and project pages because it's easy.

GitHub pages does have a limitation, though: there is no concept of a server. While you might not notice that on smaller projects or experiments, it is inevitable that you will run into it eventually. Sometimes you just want a server.

[Heroku](https://www.heroku.com/) enables you to have the concept of a server, with a similar work-flow: make something, then push to a remote with git and it's on the internet. But Heroku costs money. It's free at first, but as you scale, it begins to get more expensive fairly quickly. Add a couple more dynos and you're already up to $70.

> Enter Dokku, an open source mini-Heroku.

With Dokku, you can run your own (albeit slightly less feature-rich) Heroku. With a $5 / month Digital Ocean droplet, this DIY solution is pretty inexpensive and easy to set up. By following [several](https://gist.github.com/ngoldman/7287753) [tutorials](https://www.digitalocean.com/community/articles/how-to-use-the-digitalocean-dokku-application) written by [people](https://twitter.com/ungoldman) [smarter](https://twitter.com/aranasaurus) than I am, I was able to set up Dokku to act as my gh-pages and Heroku on a custom domain. Plus I got the feeling of satisfaction that can only come with doing something yourself! Do you want to go to there? Read on, intrepid adventurer!

## 1. Get a Domain Name

I recommend [namecheap](https://www.namecheap.com/) only because I have experience with them and they're not Godaddy... I registered [app-lab.me](http://app-lab.me) for $8 a year.

## 2. Create a Digital Ocean Account

Create an account with Digital Ocean: [digitalocean.com](https://cloud.digitalocean.com/registrations/new). Use the coupon code JEDGAR for $55 free.

## 3. Create a Droplet

Make a [new droplet](https://cloud.digitalocean.com/droplets/new) in DigitalOcean. Be sure to name the droplet exactly what your domain is. For example, I named my droplet `app-lab.me`. Select the smallest size, and whatever region is closest to you.

In the "Select Image" section, click the "Applications" tab and choose the "Dokku-v0.2.3 on Ubuntu 14.04" option.

Click "Create Droplet".

## 4. Configure the DNS

To get your domain to point to your new droplet, you need to change the DNS records. Just go to the page to edit "All Host Records", in Namecheap that can be found at:  * My Account > Manage Domains > Modify Domain > All Host Records*. Use the following host name and subdomain settings:

| HOST NAME | IP ADDRESS/URL | RECORD TYPE | MX PREF | TTL |
| --- | --- | --- | --- | --- |
| @ | your.droplet.ip.address | A (Address) | n/a | 60 |
| www | your.domain | URL Redirect (301) | n/a | 60 |
| * | your.ip.address.k.thx | A (Address) | n/a | 60 |

The * entry for subdomains allows you to make any number of apps on different subdomains.

## 5. Generate an SSH Key Pair

I'll describe what these are in more detail below in the "Set up SSH Keys" section. Don't worry too much about it right now, just generate a pair like this:

- Go into your .ssh directory: `cd ~/.ssh`
- Type: `ssh-keygen`
- When prompted, enter a name for the pair (I used app-lab)
- If you'd like to password protect it enter a password (I left this blank)

After it's done, you should have two files: `{name}` and `{name}.pub`

## 6. Set up the Droplet

If you go to the IP address (in the email or listed in Digital Ocean) you should see a screen that has several fields. Add a public ssh key from the previous step (that's the one that ends in `.pub`).

Hostname should be your domain name exactly. For me, hostname was "app-lab.me".

Check "virtual host naming" if you'd like your Dokku apps to be formatted like `app-name.your.domain`.

Click "Finish Setup"

## 7. Connect to your Droplet

First, ensure that your domain is pointing at the droplet's IP Address. Type: `dig +short your.domain`. This should respond with the IP Address of your droplet.

If that was a success, now you can connect to your droplet with your password. You should have received an email with your IP address and password. Use `ssh` to connect to your droplet: `ssh root@your.domain` then enter your password and you should be in!

## 8. Set up SSH Keys

To make it so you don't have to type your password every time you connect to your droplet or push to Dokku, you can set up ssh keys. Basically, there are two files, one that is on your machine, and one that is on the Digital Ocean droplet. The droplet checks to make sure you have the key that matches it's key, and automatically connects you without a password. We created the keys a few steps back, now let's use them to connect to our droplet.

#### Make Sure you Have the Keys

- Go into your .ssh directory: `cd ~/.ssh`
- Ensure your keys you generated previously are still there. You should see them listed if you type `ls -l`.
- If they aren't there, generate a new pair (see above).

#### Create a Config File

Create a file named `config` inside your `.ssh/` directory so your computer knows to use the new ssh keys for your domain. My config looks like this:

```
Host app-lab app-lab.me
Hostname app-lab.me
IdentityFile ~/.ssh/app-lab
```

Basically, this is how ssh knows to use that particular key for that host. Obviously change `app-lab.me` to your domain, and `.ssh/app-lab` to whatever you named your ssh keys.

#### Put the Public Key on your Droplet

To upload the public key to your droplet, just type:

```
cat ~/.ssh/{name}.pub | ssh root@your.domain "cat >> ~/.ssh/authorized_keys"
```

Replacing the `{name}` with your key name and `your.domain` with your domain name.

#### Connect Without a Password

You should now be able to now connect to your droplet without a password like this: `ssh root@your.domain`

If that worked, you can now (optionally) disable password login to your droplet:
- Connect to your droplet: `ssh root@your.domain`
- Open your config: `sudo nano /etc/ssh/sshd_config`
- Find the `PermitRootLogin` line and edit it so it reads: `PermitRootLogin without-password`
- Reload your ssh: `reload ssh`

## 9. Deploy an App to a Subdomain

Now you're all set to deploy apps to Dokku. If you want to deploy a test app, you can use the Node JS Test App:

- clone the repo: `git clone git@github.com:heroku/node-js-sample.git`
- `cd node-js-sample`
- add Dokku as a remote: `git remote add dokku dokku@your.domain:test`
- push to Dokku: `git push dokku master`

After Dokku finishes deploying your app and reports back that it's finished, your app should be live at test.your.domain. Notice that the subdomain will be whatever you entered after the colon in your remote name. For example, if you want your app to live at apples.your.domain, you could add your remote like:

```
git remote add dokku dokku@your.domain:apples
```

## Deploying an App to the Root Domain

To add an app to the root domain, you just use the domain name when you add the remote. For example, if your domain was chickens.me, you would add your remote like this:

```
git remote add dokku dokku@chickens.me:chickens.me
```

Once you push, the app will be live at chickens.me.

## Deploying an App to Another Domain

It's also pretty easy to use another domain and point it to Dokku. It works similarly to how you add a project to the root domain (see above).

Let's say you are building a little site for a domain you own, we'll call it my-special-domain.com, but you set up Dokku on another domain like dokku-domain.com. When you decide to deploy your site, all you need to do is change the DNS records for my-special-domain. Go to the "All Host Records" page for my-special-domain.com (in Namecheap: "My Account > Manage Domains > Modify Domain") and change the @ and www entries so they read like this:

| HOST NAME | IP ADDRESS/URL | RECORD TYPE | MX PREF | TTL |
| --- | --- | --- | --- | --- |
| @ | YOUR.DROPLET.IP.ADDRESS | A (Address) | n/a | 60 |
| WWW | YOUR.DOMAIN | CNAME | n/a | 60 |

Then when you add your remote, you would add it like this:

```
git remote add dokku dokku@dokku-domain.com:my-special-domain.com
```

Once the domain is pointing to your droplet's IP and you've pushed to your remote, you should see your app on my-special-domain.com.

## Deploying a Static App in a Subfolder

Deploying a static app actually took a bit of hunting around to find, but once I figured it out, it's dead simple. Essentially you just include an empty `.nginx` file in the root level of your project, and put all your static content in a `www` directory and it will be served on an nginx server automatically. For example, if I had a simple `index.html` file and a `style.css` file I wanted to serve statically, my project would look something like this:

```
.nginx
www
  - index.html
  - style.css
```

That's it! You can have as many folders and files inside the `www` directory as you need and it will serve it up statically for you. This is really useful if you use a static site generator to produce a folder of html as you can just set it to build to `/www` and your site will automatically work.

## Deploying a Static App From the Root Folder

If you have no need for a subfolder, you can deploy a static app from the root of your project by adding an empty `.htaccess` file. The folder structure would look something like this:

```
.htaccess
index.html
style.css
```

Dokku should automagically understand that you're writing an app that uses Apache and give you a simple static site after you push.

## Deploying a Static App with Password Protection

This is a really good reason to use Dokku instead of gh-pages. It is super common to want to keep a project private from the general public and only allow clients, or other developers to see it. It took me forever to figure this out, and when I did I felt really stupid because it is ridiculously easy. Essentially, you deploy a static app exactly as above, but you add a `.htpasswd` file to the root of your app and a couple lines to your `.htaccess` file. Essentially your `.htaccess` file will look something like this:

```
AuthUserFile /app/www/.htpasswd
AuthType Basic
AuthName "Restricted Access"
Require valid-user
```

Then, you can go to this [htpasswd generator site](http://www.htaccesstools.com/htpasswd-generator/). Enter the username and password and copy the generated entry into a `.htpasswd` file, also in the root of your project. Your folder structure will look something like this:

```
.htaccess
.htpasswd
index.html
```

When you push to Dokku, it will use your .htaccess file and require you to login. It will probably save your password, so a computer will only need to log in once.

## Deleting an App

If you want to remove an app, first, connect with ssh:

```
ssh root@your.domain
```

If you set up ssh keys, this should work without a password. Then simply run:

```
dokku delete app_name
```

Where `app_name` is the name of the app you'd like to delete.

## Final Thoughts and Credits

This post is just notes from going through this process myself. I followed my brilliant coworker Nate's ([ngoldman](https://twitter.com/ungoldman)) write-up, which you can read [here](https://gist.github.com/ngoldman/7287753). Since I'm pretty new to all this, there were a couple stumbling blocks for me (especially dealing with ssh keys), so I wanted to put this out there and make it available in case other people had trouble with the same things.

If there's anything that could be improved, or is just totally wrong, tweet at me: [@paulcpederson](https://twitter.com/paulcpederson).

