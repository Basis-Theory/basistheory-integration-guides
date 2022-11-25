---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
title: Developers Home
permalink: /
nav_order: 1
has_children: false
image:
    path: https://cdn.basistheory.com/images/seo/guides-opengraph.png
    width: 1200
    height: 630
---

<html>
    <head>
        <meta charset="utf-8">
        <title>Basis Theory Overview</title>
    </head>
    <body class="home-page">
        <div class="header">
            <h1>Documentation</h1>
        </div>
        <h5>Explore our APIs, SDKs, and all of the tools you need to make your sensitive data more secure and usable.</h5>
        <div class="quickstarts">
            <div class="quickstart-info">
                <div class="quickstart-header">Quickstarts</div>
                <div class="quickstart-subtitle">In just a few steps, learn how to secure and use your data with Basis Theory's tokenization.</div>
                <div class="quickstart-action">
                    <a href="/getting-started">Quick start</a>
                    <img src="./assets/images/icons/blue-time.svg" alt="time-icon">
                    <div>10 min</div>
                </div>
            </div>
        </div>
        <div class="sub-header">
            Concepts
        </div>
        <div class="cards">
            <a class="card" href="/concepts/what-are-tokens">
                <div class="icon-and-time-estimate">
                    <img src="./assets/images/icons/blue-token.svg">
                    <div class="time-estimate">
                        <img src="./assets/images/icons/grey-time.svg" alt="time-icon">
                        <div>5 min</div>
                    </div>
                </div>
                <div class="card-title">What are Tokens?</div>
                <div class="card-description">Use Tokens to secure and share your sensitive data.</div>
            </a>
            <a class="card" href="/concepts/what-are-tenants">
                <div class="icon-and-time-estimate">
                    <img src="./assets/images/icons/blue-terminal.svg">
                    <div class="time-estimate">
                        <img src="./assets/images/icons/grey-time.svg" alt="time-icon">
                        <div>5 min</div>
                    </div>
                </div>
                <div class="card-title">What are Tenants?</div>
                <div class="card-description">Where your Tokens and Applications are defined, managed, and stored.</div>
            </a>
            <a class="card" href="/concepts/what-is-the-proxy">
                <div class="icon-and-time-estimate">
                    <img src="./assets/images/icons/blue-reactor.svg">
                    <div class="time-estimate">
                        <img src="./assets/images/icons/grey-time.svg" alt="time-icon">
                        <div>5 min</div>
                    </div>
                </div>
                <div class="card-title">What is the Proxy?</div>
                <div class="card-description">Send HTTP requests with tokenized data without touching it.</div>
            </a>
        </div>
        <div class="sub-header">
            Guides
        </div>
        <div class="cards">
            <div class="card guide">
                <div class="icon-and-guides">
                    <img src="./assets/images/icons/shield-down-arrow.svg" alt="shield-down-arrow">
                    <div class="guides">
                        <div class="card-title">Secure Your Data</div>
                        <div class="card-description">Learn how to easily tokenize your data on any platform.</div>
                        <div class="guides-list">
                            <li><a href="/guides/collect-cards-with-elements-react">Collect Credit Cards with React <span class="guide-time-estimate">5m</span></a></li>
                            <li><a href="/guides/encrypt-us-banks-in-your-applications">Encrypt U.S Banks in your applications <span class="guide-time-estimate">10m</span></a></li>
                            <li><a href="/guides/style-elements-for-my-brand">Style elements to match your brand <span class="guide-time-estimate">10m</span></a></li>
                            <li><a href="/guides/collect-pii-js">Collect Customer Data (PII) with JS <span class="guide-time-estimate">5m</span></a></li>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card guide">
                <div class="icon-and-guides">
                    <img src="./assets/images/icons/shield-up-arrow.svg" alt="shield-up-arrow">
                    <div class="guides">
                        <div class="card-title">Use Your Data</div>
                        <div class="card-description">Learn how to integrate and make the most out of tokenized data.</div>
                        <div class="guides-list">
                            <li><a href="/guides/use-token-data-in-http-requests">Use Token Data in HTTP Requests <span class="guide-time-estimate">10m</span></a></li>
                            <li><a href="/guides/use-us-bank-accounts-without-touching-them">Use U.S. Bank Accounts <span class="guide-time-estimate">10m</span></a></li>
                            <li><a href="/guides/collect-cards-with-elements">Collect and Charge Credit Cards with JS <span class="guide-time-estimate">15m</span></a></li>
                            <li><a href="/guides/use-token-data-in-reactors">Use Token Data in Reactors <span class="guide-time-estimate">10m</span></a></li>
                            <li><a href="/guides/reveal-cards-with-react">Reveal Card Data w/ React<span class="guide-time-estimate">10m</span></a></li>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sub-header">
            Reference
        </div>
        <div class="cards">
            <a class="card" href="https://docs.basistheory.com/api-reference/#introduction">
                <div class="icon-and-time-estimate">
                    <img src="./assets/images/icons/purple-token.svg">
                </div>
                <div class="card-title">API Reference</div>
                <div class="card-description">Use our API's and SDK's to interact with your Tokens.</div>
            </a>
            <a class="card" href="https://docs.basistheory.com/elements/#introduction">
                <div class="icon-and-time-estimate">
                    <img src="./assets/images/icons/purple-terminal.svg">
                </div>
                <div class="card-title">Elements</div>
                <div class="card-description">Secure data from your frontend without touching it.</div>
            </a>
            <a class="card" href="https://docs.basistheory.com/expressions/#introduction">
                <div class="icon-and-time-estimate">
                    <img src="./assets/images/icons/purple-reactor.svg">
                </div>
                <div class="card-title">Expressions</div>
                <div class="card-description">Learn about the expression language supported throughout the Basis Theory API.</div>
            </a>
        </div>
    </body>
</html>