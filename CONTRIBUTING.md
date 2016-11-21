# Contributing Guidelines

Welcome, and thanks in advance for your help! Please follow these simple guidelines.

## How to contribute to Serverless

The easiest way to contribute to Serverless is to start chiming into the different [issue](https://github.com/serverless/serverless/issues) and [PR](https://github.com/serverless/serverless/pulls) discussions.

Additionally you might want to dive right into the codebase. Let's see how you can find things to work on.

## When you want to start on something we need

The easiest way to find things to work on is to check out our [issues](https://github.com/serverless/serverless/issues). There you can filter by different labels such as experience (`exp/x` labels), kinds (`kind/x`) or status (`status/x`) to find things you're interested in.

In there you will find different issues that we think are important and need some help with. If you're just starting to contribute to Serverless you might want to check out the `help-wanted-easy` label first, but as an experienced developer the `help-wanted` should be fine as well. The difference is mostly in how much time the tasks will take to implement. Thanks for helping us with those, we really appreciate it.

## When you want to propose a new feature or bug fix

* Please make sure there is an open issue discussing your Contribution.
* If there isn't, please open an issue so we can talk about it before you invest time into the Implementation.
* When creating an issue follow the guide that Github shows so we have enough information about your proposal.

## Pull Requests

Please follow these Pull Request guidelines when creating Pull Requests:

* If an Issue exists, leave a comment there that you are working on a solution so nobody else jumps on it.
* If an Issue does not exist, create a new Issue, detail your changes. We recommend waiting until we accept it, so you don't waste your precious time.
* Follow our [Testing](#testing) and [Code Style](#code-style) guidelines below.
* Start commit messages with a lowercase verb such as "add", "fix", "refactor", "remove".
* Submit your PR and make sure the Travis-CI builds don't fail and the code coverage isn't lowered.
* Reference the issue in your PR.

## Issues
Please follow these Issue guidelines for opening Issues:

* Make sure your Issue is not a duplicate.
* Make sure your Issue is for a *feature request*, *bug report*, or *a discussion about a relevant topic*. For everything else, please use our [Discourse Forum](http://forum.serverless.com)

## Code Style

We aim for clean, consistent code style.  We're using ESLint to check for codestyle issues using the Airbnb preset. If ESLint issues are found our build will fail and we can't merge the PR.  To help reduce the effort of creating contributions with this style, an [.editorconfig file](http://editorconfig.org/) is provided that your editor may use to override any conflicting global defaults and automate a subset of the style settings.  You may need to enable EditorConfig's use by changing a setting or installing a plugin.  Using it is not compulsory.

Please follow these Code Style guidelines when writing your unit tests:

* In the root of our repo, use this command to check for styling issues: `npm run lint`
* There are likely ESLint plugins for your favorite code editor that will make this easier too!

## Testing

We aim for 100% test coverage, so make sure your tests cover as much of your code as possible.  For test coverage, we use Istanbul locally and Coveralls on our repo.  During development, you can easily check coverage by running `npm test`, then opening the `index.html` file inside the `coverage` directory.

Please follow these Testing guidelines when writing your unit tests:

*  Include a top-level `describe('ClassName')` block, with the name of the class you are testing.
*  Inside that top-level `describe()` block, create another `describe('#methodOne()')` block for each class method you might create or modify.
*  For each method, include an `it('should do something')` test case for each logical edge case in your changes.
*  As you write tests, check the code coverage and make sure all lines of code are covered.  If not, just add more test cases until everything is covered.
*  For reference and inspiration, please check out the `*.test.js` files.

### Testing templates

If you add a new template or want to test a template after changing it you can run the template integration tests. Make sure you have `docker` and `docker-compose` installed as they are required. The `docker` containers we're using through compose are automatically including your `$HOME/.aws` folder so you can deploy to AWS.

To run all integration tests run:

```
./tests/templates/test_all_templates
```

To run only a specific integration test run:

```
tests/templates/integration-test-template TEMPLATE_NAME BUILD_COMMAND
```

so for example:

```
tests/templates/integration-test-template aws-java-maven mvn package
```

If you add a new template make sure to add it to the `test_all_templates` file and configure the `docker-compose.yml` file for your template.

## Providing Support

The easiest thing you can do to help us move forward and make an impact on our progress is to simply provide support to other people having difficulties with their Serverless projects. You can do that by replying to [issues on Github](https://github.com/serverless/serverless/issues), chatting with other community members in [our Chat](http://chat.serverless.com) or helping with questions in [our Forum](http://forum.serverless.com).

## Improving Documentation

Maintaining and updating the docs on a regular basis is a hard task. The more eyeballs on the docs the higher quality it'll get and the less chances there will be for typos and confusion. We keep our docs in the `docs` folder in our main repo. If you see any issues with our docs, simply open an issue or a PR.

## Reviewing Pull Requests

We get lots of great [Pull Requests](https://github.com/serverless/serverless/pulls). A great way to contribute to the project is to review and test Pull Requests. This speeds up the process to get Pull Requests merged and therefore helps us a lot!

## Labels

This file contains information about the [labeling](https://github.com/serverless/serverless/labels) we use for our [issues](https://github.com/serverless/serverless/issues) and [Pull Requests](https://github.com/serverless/serverless/pulls).

| Label | Used for | Description |
|----|----|----|
| exp/beginner | Issue | Issues which are great way to get started with the project. |
| exp/intermediate | Issue | Working on these issues needs a little bit more experience with the codebase. |
| exp/expert | Issue | A deep understanding of the codebase is needed to work on these issues. |
| kind/bug | Issue | Bugs which should be fixed ASAP. |
| kind/docs | Issue | Additions / updates for our documentation. |
| kind/enhancement | Issue | Enhancement for an already existent feature. |
| kind/feature | Issue | A new feature. |
| kind/question | Issue | Question about usage of the framework. |
| kind/refactoring | Issue | Codebase refactoring |
| kind/test | Issue | Test related issues |
| priority/P0 | Issue | Urgent issue. Everything should be dropped and work on this one should start immediately. |
| priority/P1 | Issue |  |
| priority/P2 | Issue | |
| priority/P3 | Issue | |
| status/accepted | Issue | |
| status/confirmed | Issue | |
| status/more-info-needed | Issue / Pull Request | |
| status/needs-attention | Issue / Pull Request | |
| status/0-triage | Pull Request | |
| status/1-design-review | Pull Request | |
| status/2-code-review | Pull Request | |
| status/3-docs-review | Pull Request | |
| status/4-merge | Pull Request | |

## Our Code of Conduct

Finally, to make sure you have a pleasant experience while being in our welcoming community, please read our [code of conduct](CODE-OF-CONDUCT.md). It outlines our core values and believes and will make working together a happier experience.

Thanks again for being a contributor to the Serverless Community!

Cheers,

The [Serverless](http://www.serverless.com) Team
