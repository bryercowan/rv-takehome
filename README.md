# Bryer's RV Take Home

## Chosen Path
* I chose option B, this was chosen because velocity of our own workers are important, and if they don't like using our software, how are they supposed to sell it? I also felt this path had a better chance to showcase what I have to offer as a developer. Faster detection of deal failures, faster deal pipelines, more revenue.
* I failed to get to Milestone 2

## AI Collab Report
* I used AI throughout my developing as it is built into my neovim editor. I should have wrote down specifically but I was in the groove and honestly forgort. I usually take this iteration step:
    * AI first stab
    * I refine, fix errors, rename where needed
    * I ask AI to refine my work
    * I test manually to see if I like the outcome, if not repeat refining steps
* I also used AI to heavily try and mirror the style used on the dashboard as this mindless easy task is right up this alley.

## Technical Decisions:
* I broke out transactions to its own page, while this is more clicks and less seamless, I believe a full page view for this feature was necessary.
* A lot of my technical decisions were prompted by the time constraint, but above all else I believed delivering really well polished features were more important.
* More in detail decisions
    * React-Query and invalidating queries imo are a worse option but way easier to get working than websockets in this short of a time period
    * react-simple-maps very lightweight package that saves a bunch of time and size over better packages. 
    * rechart for KPI, super fast to implement and well polished package
    *  Added more seeds to show KPIs better
    * Left out better KPI filters in favor of making sure current features were well polished
    * I could not get to testing, this was a time constraint.

## Demo Guide
* Click  the [Open Territory Dashboard](http://localhost:3000/territories)
* filter the map by clicking a region, this updates the KPI and deal table
* Filter deal table by searching any text in a deal, or selecting what stage the deal is in.
* Select all deals or individually and click reassign, give it a new rep and the deals table will be refreshed!


## Test Coverage
* As stated above, I ran out of time to implement tests. I like to create working features, then test for edge cases after to keep me focused. 
* I will happily implement tests if requested!

## Brief Demo
[Demo Video](rvt.mov)
