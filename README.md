# Batch Delete Email
Delete gmail email in bulk, via the api, given a series of search strings.

## Using this in your own project (WIP -- bash / zsh)

### Setup
- enable to the Apps Script API. https://script.google.com/home/usersettings

### Creating a project from a Browser
1. Navigate to https://script.google.com/home/my.
1. Click "New Project".
1. Give it a name better than "Untitled Project".
1. Click the :gear: icon.
1. Copy the Script ID and save it for later.
1. Go to your https://drive.google.com and create a new Google Sheet.
1. Name the first tab "SearchCriteria"
1. Add 3 columns: "Search Criteria", "Description", "Active"
1. Make note of the Sheet ID, it will be the alphanumeric in the url between `/d/`and `/edit`
1. Go back to project settings, where you found teh Script ID earlier
1. Create a new script property called `CRITERIA_SPREADSHEET_ID` and give it the value of your Sheet ID

### (Alternative) Creating a project with the CLI - WIP
- `clasp create --title "Some Project Name"`
- ???

### Up and running
1. Fork the repository
1. Clone locally
1. `npm i && npm test`
1. `npm run login`
1. Make note of the location of your `.clasprc.json`, likely in your home directory.
1. Add Repository level action secrets in Github: `CLASP_CREDENTIALS` and `SCRIPT_ID`, these should be the contents of the `.clasprc.json` and your Script ID respectively.

# Original Authors
- [@d1verjim](https://github.com/d1verjim)
- [@1shooperman](https://github.com/1shooperman)

# Reference(s)
- https://developers.google.com/apps-script/reference/gmail/gmail-message
- https://support.google.com/mail/answer/7190?hl=en

# Additional Notes
- You can manually test your email search criteria from the Gmail Web UI search box!
- Some of this was written / refactored using [Cursor.ai](https://www.cursor.com/)

## Example Search Strings
- `older_than:30d`
- `from: *@foo.com`
- `has:nouserlabels`
- `subject:"Test Foo" AND NOT is:starred older_than:1y`
- `category:promotions older_than:7d has:nouserlabels AND NOT is:starred AND NOT is:important`

## API Reference

[//]: # "This section is auto-generated. Run 'npm run docs' to update"

<!-- API -->
## Constants

<dl>
<dt><a href="#MAX_BATCH_SIZE">MAX_BATCH_SIZE</a> : <code>number</code></dt>
<dd><p>Maximum number of threads to process in a single batch</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#batchDeleteEmail">batchDeleteEmail()</a> ⇒ <code>number</code></dt>
<dd><p>Deletes emails in batches based on search criteria</p>
</dd>
<dt><a href="#collectThreadBatches">collectThreadBatches(criteria)</a> ⇒ <code>Array.&lt;Array.&lt;GmailThread&gt;&gt;</code></dt>
<dd><p>Collects threads into batches based on search criteria</p>
</dd>
<dt><a href="#searchThreads">searchThreads(criteria)</a> ⇒ <code>Array.&lt;GmailThread&gt;</code></dt>
<dd><p>Searches for threads matching the given criteria</p>
</dd>
<dt><a href="#deleteAllThreadBatches">deleteAllThreadBatches(threadBatches)</a> ⇒ <code>number</code></dt>
<dd><p>Deletes all threads in the given batches</p>
</dd>
<dt><a href="#deleteThreads">deleteThreads(threads)</a></dt>
<dd><p>Deletes a batch of threads</p>
</dd>
</dl>

<a name="MAX_BATCH_SIZE"></a>

## MAX\_BATCH\_SIZE : <code>number</code>
Maximum number of threads to process in a single batch

**Kind**: global constant  
<a name="batchDeleteEmail"></a>

## batchDeleteEmail() ⇒ <code>number</code>
Deletes emails in batches based on search criteria

**Kind**: global function  
**Returns**: <code>number</code> - Total number of threads deleted  
<a name="collectThreadBatches"></a>

## collectThreadBatches(criteria) ⇒ <code>Array.&lt;Array.&lt;GmailThread&gt;&gt;</code>
Collects threads into batches based on search criteria

**Kind**: global function  
**Returns**: <code>Array.&lt;Array.&lt;GmailThread&gt;&gt;</code> - Array of thread batches  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>Array.&lt;string&gt;</code> | Array of search criteria |

<a name="searchThreads"></a>

## searchThreads(criteria) ⇒ <code>Array.&lt;GmailThread&gt;</code>
Searches for threads matching the given criteria

**Kind**: global function  
**Returns**: <code>Array.&lt;GmailThread&gt;</code> - Array of found threads  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>string</code> | Search criteria |

<a name="deleteAllThreadBatches"></a>

## deleteAllThreadBatches(threadBatches) ⇒ <code>number</code>
Deletes all threads in the given batches

**Kind**: global function  
**Returns**: <code>number</code> - Total number of threads deleted  

| Param | Type | Description |
| --- | --- | --- |
| threadBatches | <code>Array.&lt;Array.&lt;GmailThread&gt;&gt;</code> | Array of thread batches |

<a name="deleteThreads"></a>

## deleteThreads(threads)
Deletes a batch of threads

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| threads | <code>Array.&lt;GmailThread&gt;</code> | Array of threads to delete |


<!-- /API -->