// Grok-only delivery policy. The shared server and other hosts retain MCP Apps.
export const deliveryGuidance = `GROK REPORT DELIVERY: Save the report with carbon_report, then use Grok's supported file attachment/artifact tool to attach the returned htmlPath to this conversation. Use the actual clickable file card or URL returned by that host tool. A saved path alone is not user delivery. Never invent a URL, publish the report, expose a server, or put a cloud localhost/capability URL in chat. Review the export for secrets/private data first. After attachment, tell the user: "Open the attached interactive report. Choose Preview to view the report; Source shows its HTML." Only if the host returns an actual artifact URL, label that unchanged URL "Open interactive report"; otherwise refer to the actual file card. Never append a preview parameter or claim this wording forces or refreshes the host view. If Preview stays blank, explain that switching Source then Preview worked in one test but is not a guaranteed fix. Ask the user to open the actual artifact; claim delivery/rendering only after host evidence. If the host cannot attach files, report delivery blocked. This Grok workflow uses saved HTML artifacts, not inline MCP Apps or live panel polling. Record updates with carbon_update and export a new report when needed; an attachment is a snapshot.`;
export function grokText(text) {
  return String(text)
    .replace(/Hosts that\s+support MCP Apps render[\s\S]*?Use `carbon_knowledge`/g, 'Use carbon_report and the Grok file attachment tool to deliver a saved HTML snapshot. Use `carbon_knowledge`')
    .replace(/Hosts that support MCP Apps render[\s\S]*?On first use,[\s\S]*?Closing the page is not consent or completion\./g, deliveryGuidance)
    .replace(/https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])[^\s"<>]*/gi, '[Bot-local URL withheld]');
}
export function artifactResult(result, name) {
  if(result.isError) return {...result, content:result.content?.map(c=>c.type==='text'?{...c,text:grokText(c.text)}:c)};
  let data=result.structuredContent;
  if(!data) { try { data=JSON.parse(result.content?.find(c=>c.type==='text')?.text); } catch { return result; } }
  const cleaned={...data};
  for(const key of ['url','browserUrl','openTarget','reportUrl','panel','placement','onboarding']) delete cleaned[key];
  cleaned.delivery={mode:'grok-file-artifact',status:'attachment-required',htmlPath:cleaned.htmlPath||null,instructions:deliveryGuidance};
  if(!cleaned.htmlPath && cleaned.runId) cleaned.delivery.nextTool={name:'carbon_report',arguments:{root:cleaned.root,runId:cleaned.runId}};
  const safe=JSON.parse(grokText(JSON.stringify(cleaned)));
  return {content:[{type:'text',text:JSON.stringify(safe)}],structuredContent:safe};
}
export function grokTool(tool) {
  const t={...tool};delete t._meta;
  if(t.name==='carbon_start') t.description='Start a bounded saved assessment. Record observations with carbon_update, then export carbon_report and attach its HTML using Grok file delivery. Does not execute tests or display inline UI.';
  if(t.name==='carbon_panel') t.description='Read current run state and identify the run for carbon_report export. In Grok, deliver saved HTML through a supported file attachment; no inline panel is promised.';
  if(t.name==='carbon_report') t.description='Save a portable HTML report and return htmlPath. Then attach the reviewed file using Grok supported artifact delivery. A filesystem path is not a clickable user artifact.';
  if(t.name==='carbon_status') t.description='Read compact saved run state. Grok uses report snapshots rather than inline panel polling.';
  return t;
}
