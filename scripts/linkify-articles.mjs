import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const banal = (name) => `../../#ai-tools?q=${encodeURIComponent(name)}`;

const L = {
  kiloCode: { ext: 'https://kilo.ai/', banal: banal('Kilo Code') },
  kiloDocs: { ext: 'https://docs.kilo.ai/' },
  kiloGateway: { ext: 'https://kilo.ai/gateway', banal: banal('Kilo Gateway') },
  kiloLeaderboard: { ext: 'https://kilo.ai/leaderboard' },
  vscode: { ext: 'https://code.visualstudio.com/' },
  jetbrains: { ext: 'https://www.jetbrains.com/' },
  cursor: { ext: 'https://cursor.com/', banal: banal('Cursor') },
  cursorDocs: { ext: 'https://docs.cursor.com/' },
  antigravity: { ext: 'https://antigravity.google/', banal: banal('Google Antigravity') },
  anthropic: { ext: 'https://www.anthropic.com/' },
  claude: { ext: 'https://claude.ai/', banal: banal('Claude Free') },
  claudeCode: { ext: 'https://claude.ai/code', banal: banal('Claude Code') },
  openrouter: { ext: 'https://openrouter.ai/', banal: banal('OpenRouter Free Models') },
  openrouterFree: { ext: 'https://openrouter.ai/collections/free-models', banal: banal('OpenRouter Free Models') },
  deepseek: { ext: 'https://chat.deepseek.com/', banal: banal('DeepSeek') },
  minimax: { ext: 'https://www.minimax.io/' },
  kimi: { ext: 'https://kimi.moonshot.cn/', banal: banal('Kimi') },
  glm: { ext: 'https://huggingface.co/zai-org/GLM-5' },
  nvidia: { ext: 'https://build.nvidia.com/' },
  poolside: { ext: 'https://poolside.ai/' },
  stepfun: { ext: 'https://www.stepfun.com/' },
  banalTools: '../../#ai-tools',
  banalModels: '../../#ai-models',
  artificialAnalysis: 'https://artificialanalysis.ai/',
  codeArena: 'https://www.codesota.com/arena/code',
  kiloArticle: '../free-ai-coding-setup-2026/',
  agentsArticle: '../honest-truth-ai-coding-agents-2026/',
};

function ext(key, label) {
  return `<a href="${L[key].ext}" rel="noopener noreferrer">${label}</a>`;
}

function dual(key, label) {
  const item = L[key];
  const a = ext(key, label);
  return item.banal ? `${a} (<a href="${item.banal}" rel="noopener">Banal</a>)` : a;
}

function toolsSection(title, intro, items) {
  return `
        <div class="tools-mentioned">
          <h2>${title}</h2>
          <p>${intro}</p>
          <ul>
${items.map((i) => `            <li>${i}</li>`).join('\n')}
          </ul>
        </div>`;
}

const kiloEn = `
          <h1>Kilo Code: Professional AI Agent Coding for Free (or Very Cheap) — Without Feeling Left Behind</h1>
          <hr />
          <p>In 2026, AI coding tools have come a long way. A couple of years ago you couldn't really trust them with serious application work. Today, with the right agent setup, you can build, refactor and maintain real projects. The bottleneck is no longer raw capability. It's <strong>cost and access</strong>.</p>
          <p>The very best models (latest ${ext('claude', 'Claude Opus')}, top-tier Sonnet, GPT-5.5 etc.) get expensive fast when you use them properly with agents every day. ${dual('cursor', 'Cursor')} Pro/Ultra or direct ${ext('anthropic', 'Anthropic')} API keys quickly run into serious money — <strong>$100–200+/month</strong> is common for people who actually work this way. For freelancers, people whose life situation changed, or anyone who's just starting to earn from AI-assisted development, that's simply not realistic.</p>
          <p>This is where ${dual('kiloCode', 'Kilo Code')} changes things.</p>

          <h2>What is Kilo Code?</h2>
          <p>It's an open-source (Apache 2.0) AI coding agent that installs as a normal extension in your existing ${ext('vscode', 'VS Code')} or ${ext('jetbrains', 'JetBrains')} IDE (plus a CLI version). You don't have to switch to a forked editor like ${dual('cursor', 'Cursor')}. You keep all your extensions, shortcuts and workflow.</p>
          <p>It has proper agent modes: <strong>Code, Plan, Debug, Architect, and Orchestrator</strong> (the last one breaks big tasks into specialist sub-agents — genuinely useful). It routes through ${dual('kiloGateway', 'Kilo Gateway')} to 500+ models from 60+ providers with <strong>zero markup</strong> — you pay the provider's exact price, nothing extra. See the ${ext('kiloDocs', 'Kilo docs')} for setup.</p>

          <h2>The free tier — can you actually work professionally on it?</h2>
          <p><strong>Yes.</strong> This is the part most tools get wrong.</p>
          <p>Kilo's Gateway offers genuinely usable free models right now:</p>
          <ul>
            <li><strong>${ext('poolside', 'Laguna M.1')} (Poolside)</strong> — one of the most used models in real agent workflows (Code, Plan, Debug)</li>
            <li><strong>${ext('nvidia', 'Nemotron 3 Ultra')} (NVIDIA)</strong> — strong performer in both benchmarks and daily use</li>
            <li><strong>${ext('stepfun', 'StepFun Step 3.7 Flash')}</strong> and various ${dual('minimax', 'MiniMax')} / ${dual('glm', 'GLM')} / ${dual('kimi', 'Kimi')} free variants (availability rotates; ${dual('openrouterFree', 'OpenRouter free catalog')} is a good cross-check)</li>
            <li><strong>kilo-auto/free</strong> — automatically picks the best available free model for your session</li>
          </ul>
          <p>There is a rate limit (roughly <strong>200 requests per hour per IP</strong> for anonymous users). In practice, many developers are using this every day for real work. The models are slower than the absolute latest frontier ones and sometimes need clearer guidance or task splitting, but they deliver professional results. You can actually spend full days working with agents without hitting a wall that stops you.</p>
          <p>For comparison: ${dual('cursor', 'Cursor')}'s free Hobby tier gives you about <strong>50 serious premium agent requests + 2000 completions per month</strong>. That's enough to try the tool. It is not enough for daily professional agent work. You hit the limit in a single focused session.</p>
          <p>In Kilo on free models you can keep going. It's not "the absolute best possible", but it's good enough that you don't feel excluded from modern agentic workflows.</p>

          <h2>How to get better quality without spending a fortune</h2>
          <div class="model-card">
            <h3>Add your own API keys (Bring Your Own Key)</h3>
            <p>In Kilo this is simple and works for both agents and autocomplete.</p>
            <p><strong>${dual('minimax', 'MiniMax models (M2.x / M3)')}</strong> currently offer excellent price/performance — you can get noticeably faster and stronger results for roughly <strong>$10–30/month</strong> via ${dual('openrouter', 'OpenRouter')} or direct provider keys. ${dual('deepseek', 'DeepSeek')}, certain Qwen and ${dual('glm', 'GLM')} variants are also strong value. You stay in full control and only pay for what you actually use.</p>
          </div>
          <div class="model-card">
            <h3>Cursor route (if you prefer the polished feel)</h3>
            <p>If you like ${dual('cursor', 'Cursor')}'s experience, get their Pro plan ($20/month) and use their Composer 2.5 (not the Fast/Haiku version) or add a cheap ${dual('minimax', 'MiniMax')} key. Still far cheaper than burning top-tier tokens constantly. See ${ext('cursorDocs', 'Cursor docs')} for current plan limits.</p>
          </div>
          <div class="model-card">
            <h3>${dual('antigravity', 'Google Antigravity')} as a powerful complement</h3>
            <p>${dual('antigravity', 'Google Antigravity')} gives you very capable autonomous agents that can plan, execute code in a sandbox, browse, and more. Their preview/free tiers often have generous enough quotas for heavy planning sessions.</p>
            <p>Use it occasionally for complex architecture or big-picture planning with strong reasoning, then take that plan and execute/refine it in Kilo on free or low-cost models. Excellent combo when you want occasional "high-end" thinking without paying high-end prices every day.</p>
          </div>

          <h2>Honest truth (no marketing fluff)</h2>
          <p>Free models in Kilo will not feel exactly like running the latest Opus on every token. You'll sometimes need to steer the agent more, break tasks down, or switch models. The "magic" is a bit less automatic.</p>
          <p>But the gap is smaller than the big companies want you to believe. With decent prompting, good rules/skills setup, and Kilo's Orchestrator, the productivity jump over working without agents is massive. You can build real features, ship things, learn advanced workflows, and keep up.</p>
          <p>Most importantly: <strong>you don't get left behind</strong>. You can learn and use modern agentic development today, build a portfolio, take on paid work, and earn. When money starts coming in, you can smoothly add $20–40/month and suddenly have very fast, high-quality models (in Kilo or Cursor). No dramatic jump required.</p>

          <h2>Who this is perfect for</h2>
          <ul>
            <li>Developers who don't want (or can't) spend $100–200+ per month on tokens</li>
            <li>People who want to stay in their current VS Code or JetBrains environment</li>
            <li>Anyone who values transparency (you can see exactly what gets sent to the model)</li>
            <li>Programmers who want model choice instead of being locked into one ecosystem</li>
          </ul>

          <p>Just install the ${dual('kiloCode', 'Kilo Code')} extension, open the model picker, type "free", pick one of the available models (check the live <a href="${L.kiloLeaderboard.ext}" rel="noopener noreferrer">leaderboard</a> for what other devs are actually succeeding with right now), and try a small real task. You'll quickly see what's possible.</p>
          <hr />
          <p><strong>This isn't "free and perfect".</strong></p>
          <p>It's <strong>"free and good enough to do professional work, keep learning, and stay competitive"</strong>.</p>
          <p>In 2026, that's already a lot. And for many people it's exactly what they need to move forward without waiting until they can afford the most expensive setups.</p>
          <p>Try it. Build something. You're not as far behind as the pricing pages make it seem.</p>
          <p>For the broader model-cost picture (Opus vs MiniMax M3 vs Composer), see our <a href="${L.agentsArticle}" rel="noopener">AI agent costs article</a>.</p>
${toolsSection(
  'Tools mentioned',
  `Official sites plus matching entries in our <a href="${L.banalTools}" rel="noopener">tools directory</a> (no affiliate links).`,
  [
    `${dual('kiloCode', 'Kilo Code')} — AI coding agent (VS Code, JetBrains, CLI)`,
    `${dual('kiloGateway', 'Kilo Gateway')} — free-model routing incl. kilo-auto/free`,
    `${ext('vscode', 'VS Code')} — editor`,
    `${ext('jetbrains', 'JetBrains IDEs')}`,
    `${dual('cursor', 'Cursor')} — forked AI IDE (comparison)`,
    `${dual('antigravity', 'Google Antigravity')} — planning / heavy agent sessions`,
    `${dual('minimax', 'MiniMax')}, ${dual('deepseek', 'DeepSeek')}, ${dual('openrouter', 'OpenRouter')} — BYOK upgrades`,
    `<a href="${L.kiloLeaderboard.ext}" rel="noopener noreferrer">Kilo leaderboard</a> — what devs use in practice`,
  ]
)}`;

const kiloJa = `
          <h1>Kilo Code：AIエージェントを使った本格的なプログラミングを無料（または格安）で — 取り残されることなく</h1>
          <hr />
          <p>2026年現在、AIによるコーディングは大きく進化しました。1〜2年前までは、大規模なアプリケーションを本気で任せるのは難しかったですが、今は適切なエージェントの使い方をすれば、実際に構築・リファクタリング・保守ができるレベルになっています。問題は「AIができるかどうか」ではなく、<strong>「いくらかかるか」と「誰が使えるか」</strong>です。</p>
          <p>最高峰のモデル（${ext('claude', 'Claude Opus')}、最新のSonnet上位版、GPT-5.5など）は、エージェントを日常的に本格的に使えばすぐに高額になります。${dual('cursor', 'Cursor')}の有料プランや${ext('anthropic', 'Anthropic')}への直接課金で<strong>月100〜200ドル以上</strong>になる人も少なくありません。フリーランスや生活環境が変わった人、AIを活用した開発で稼ぎ始めたばかりの人にとっては、現実的ではありません。</p>
          <p>そこで登場するのが ${dual('kiloCode', 'Kilo Code')} です。</p>

          <h2>Kilo Codeとは？</h2>
          <p>Apache 2.0のオープンソースAIコーディングエージェントで、既存の${ext('vscode', 'VS Code')}や${ext('jetbrains', 'JetBrains')}に拡張機能としてインストールできます（CLI版もあり）。${dual('cursor', 'Cursor')}のようにVS Codeのフォークに乗り換える必要はありません。今の環境のまま、すべての拡張機能・ショートカット・設定をそのまま使えます。</p>
          <p>エージェントモードも充実（<strong>Code / Plan / Debug / Architect / Orchestrator</strong>）。Orchestratorは複雑なタスクを専門サブエージェントに分解してくれる強力な機能です。${dual('kiloGateway', 'Kilo Gateway')}経由で500以上のモデル（60以上のプロバイダー）に対応し、<strong>ゼロマークアップ</strong>です。<a href="${L.kiloDocs}" rel="noopener noreferrer">公式ドキュメント</a>でセットアップできます。</p>

          <h2>無料プランで本当に本格的に使えるのか？</h2>
          <p><strong>はい。</strong>これがKilo Codeの最大の強みです。</p>
          <p>Kilo Gateway経由で、以下のような実用レベルの無料モデルが使えます：</p>
          <ul>
            <li><strong>${ext('poolside', 'Laguna M.1')}（Poolside）</strong> — 実際の利用でCode/Plan/Debugモードで非常に人気</li>
            <li><strong>${ext('nvidia', 'Nemotron 3 Ultra')}（NVIDIA）</strong> — ベンチマークでも実務でも強い</li>
            <li><strong>${ext('stepfun', 'StepFun Step 3.7 Flash')}</strong> や ${dual('minimax', 'MiniMax')} / ${dual('glm', 'GLM')} / ${dual('kimi', 'Kimi')} 系の無料版（時期により変動；${dual('openrouterFree', 'OpenRouter無料一覧')}も参考）</li>
            <li><strong>kilo-auto/free</strong> — 自動でその時点で最も良い無料モデルを選んでくれる</li>
          </ul>
          <p>無料モデルのレートリミットは存在します（匿名ユーザーでIPあたり約<strong>200リクエスト/時間</strong>程度）が、実際の開発者の体験では「毎日本格的に作業できる」レベルです。最新のOpusよりは遅く、ときどきより丁寧に指示を出したりタスクを分割したりする必要がありますが、プロフェッショナルな成果を出せる範囲です。</p>
          <p>一方、${dual('cursor', 'Cursor')}の無料プラン（Hobby）は月<strong>50回程度のプレミアムエージェントリクエスト＋2000回の補完</strong>程度で、実務の日常使いには到底足りません。試用には十分ですが、本気で毎日使うにはすぐに上限に当たります。</p>
          <p>Kilo Codeの無料モデルなら、1日中エージェントとやり取りしながら開発を進められます。「最高峰ではないけど、ちゃんと仕事になる」——これが重要なポイントです。</p>

          <h2>品質を上げたいときの現実的な選択肢</h2>
          <div class="model-card">
            <h3>自分のAPIキーを追加する（Bring Your Own Key）</h3>
            <p>Kiloでは非常に簡単で、エージェントもオートコンプリートも全部自分のキーで使えます。</p>
            <p><strong>${dual('minimax', 'MiniMax（M2.x / M3系）')}</strong>が特にコスパが良く、月<strong>10〜30ドル</strong>程度で明らかに速くて良い結果が出せます（${dual('openrouter', 'OpenRouter')}経由も可）。他にも${dual('deepseek', 'DeepSeek')}、特定のQwen/${dual('glm', 'GLM')}なども優秀です。</p>
          </div>
          <div class="model-card">
            <h3>Cursorを使う場合</h3>
            <p>どうしても${dual('cursor', 'Cursor')}の洗練された体験が欲しいならPro（月20ドル）を契約し、Composer 2.5（Fast/Haiku以外）や安い${dual('minimax', 'MiniMax')}キーを組み合わせる。これでもフルOpusを毎回使うよりずっと安上がりです。${ext('cursorDocs', 'Cursor公式ドキュメント')}で現行プランを確認してください。</p>
          </div>
          <div class="model-card">
            <h3>${dual('antigravity', 'Google Antigravity')}との組み合わせ</h3>
            <p>${dual('antigravity', 'Google Antigravity')}はエージェント特化のCLI/プラットフォームで、プレビューや無料枠でかなり高度な計画立案・実行が可能です。</p>
            <p>重いアーキテクチャ設計や複雑な計画立案をAntigravityで一度行い、その計画をKiloに持ち込んで無料〜格安モデルで実装・反復するという使い方が非常に効果的です。高額モデルを常時使う必要がなくなります。</p>
          </div>

          <h2>正直なところ</h2>
          <p>無料モデルは、最新の最高峰モデルを常時使ったときのような「魔法のような」体験はしにくいです。ときどきエージェントをより細かく導いたり、タスクを分割したりする必要があります。しかし、良いルール設定とKiloのOrchestratorを活用すれば、エージェントなしの作業と比べて生産性が劇的に上がるのは確かです。</p>
          <p>そして何より大事なのは、<strong>取り残されない</strong>ということです。最新のエージェントワークフローを学びながら、実際にプロダクトを作り、ポートフォリオを築き、案件を受注して稼ぐことができます。収入が増えてから、月20〜40ドル程度を追加すれば、かなり快適な速度と品質が手に入ります。</p>

          <h2>こんな人におすすめ</h2>
          <ul>
            <li>月100〜200ドル以上をAIトークンに使いたくない人</li>
            <li>今のVS Code / JetBrains環境を離れたくない人</li>
            <li>透明性（実際に何がモデルに送られているか確認できる）を重視する人</li>
            <li>モデルを選べる自由が欲しい人</li>
          </ul>

          <p>今すぐ試すなら、${dual('kiloCode', 'Kilo Code')}の拡張機能をインストールして、モデルピッカーで「free」と入力して使えるモデルを選んでみてください。リアルタイムの<a href="${L.kiloLeaderboard.ext}" rel="noopener noreferrer">リーダーボード</a>も参考になります。</p>
          <hr />
          <p><strong>これは「無料で完璧」ではありません。</strong></p>
          <p><strong>「無料で十分に本格的で、ちゃんと前に進める」</strong>ツールです。</p>
          <p>今の時代において、それはすでに非常に大きな価値があります。</p>
          <p>モデルコスト全体（Opus vs MiniMax M3 vs Composer）は<a href="${L.agentsArticle}" rel="noopener">エージェントコスト記事</a>も参照。</p>
${toolsSection(
  '掲載ツール一覧',
  `<a href="${L.banalTools}" rel="noopener">ツール一覧</a>での該当エントリ（アフィリエイトリンクなし）。`,
  [
    `${dual('kiloCode', 'Kilo Code')} — AIコーディングエージェント`,
    `${dual('kiloGateway', 'Kilo Gateway')} — 無料モデルルーティング`,
    `${ext('vscode', 'VS Code')}`,
    `${ext('jetbrains', 'JetBrains')}`,
    `${dual('cursor', 'Cursor')}`,
    `${dual('antigravity', 'Google Antigravity')}`,
    `${dual('minimax', 'MiniMax')}、${dual('deepseek', 'DeepSeek')}、${dual('openrouter', 'OpenRouter')}`,
    `<a href="${L.kiloLeaderboard.ext}" rel="noopener noreferrer">Kiloリーダーボード</a>`,
  ]
)}`;

const agentsEn = `
          <h1>The Honest Truth About AI Coding Agents in 2026</h1>
          <p class="article-meta">(Or: How I stopped burning hundreds of dollars a month and still get things done)</p>
          <hr />
          <p>Listen. I've burned through thousands of dollars and thousands of hours with these things. I've worked in places where managers in suits tell you "just buy the $20 ${dual('cursor', 'Cursor')} license and use whatever's cheap, bro." Then in the next breath they're like "make sure you use Opus for the important stuff."</p>
          <p>It's pure corporate theater.</p>
          <p>The reality? If you actually want to use real agents — the kind that spin up, test your whole app, take screenshots of the UI, fix bugs, run terminal commands, and then casually email you "hey, everything looks good, I even added the dark mode you forgot about" — the top models will happily eat <strong>hundreds of dollars a month</strong>. Not $50. Not $100. We're talking <strong>$200–400+</strong> if you're using them properly for real work, multiple hours a day.</p>
          <p>Because here's the dirty little secret nobody in those meetings wants to say out loud: <strong>output tokens are expensive as hell</strong>, and agent workflows are output-heavy. Every iteration, every code block, every reasoning trace, every tool call… it adds up fast.</p>

          <h2>The uncomfortable math</h2>
          <p>Take ${ext('claude', 'Claude Opus')} (current generation via ${ext('anthropic', 'Anthropic')}). You're looking at roughly <strong>$5 per million input tokens</strong> and <strong>$25 per million output tokens</strong> on direct API pricing — verify on <a href="${L.banalModels}" rel="noopener">Banal's models panel</a> before you budget.</p>
          <p>Now run a proper agent session in ${dual('cursor', 'Cursor')}, ${dual('claudeCode', 'Claude Code')}, or ${dual('antigravity', 'Google Antigravity')}:</p>
          <ul>
            <li>Big context (whole repo or long history)</li>
            <li>Multiple tool calls</li>
            <li>Generating + fixing code</li>
            <li>Analyzing screenshots (multimodal)</li>
            <li>Writing summaries or emails</li>
          </ul>
          <p>Do that for a few serious hours and watch the bill climb. It's not theoretical. People are actually paying this.</p>
          <p>And the worst part? A lot of the time you don't even need the absolute best model for 80–90% of what you're doing.</p>

          <h2>The models that actually make sense long-term</h2>
          <p>Right now there are models that are shockingly close to the frontier on coding and agentic tasks while costing a fraction of the price. The one I keep coming back to is <strong>${dual('minimax', 'MiniMax M3')}</strong>.</p>
          <div class="model-card">
            <h3>MiniMax M3</h3>
            <ul>
              <li><strong>Price:</strong> $0.30 / $1.20 per million input/output on ${dual('openrouter', 'OpenRouter')} and the ${ext('minimax', 'MiniMax')} platform — sometimes even better with caching.</li>
              <li>That's roughly <strong>16–20× cheaper on output</strong> than Opus.</li>
              <li><strong>1M context window.</strong></li>
              <li><strong>Native multimodal</strong> (text + image + video) — perfect when your agent needs to actually see the UI it just built.</li>
              <li>On coding and agent leaderboards (<a href="${L.artificialAnalysis}" rel="noopener noreferrer">Artificial Analysis</a>, <a href="${L.codeArena}" rel="noopener noreferrer">Code Arena</a>, etc.) it sits right up there with the big names on practical tasks — SWE-Bench style work, terminal agents, multi-file edits. Not always #1, but close enough that the gap often doesn't justify the 10–20× price difference for daily work.</li>
            </ul>
          </div>
          <p>Then there's <strong>${dual('cursor', 'Cursor')}'s Composer 2.5</strong> (the non-thinking/fast version).</p>
          <div class="model-card">
            <h3>Cursor Composer 2.5 (fast)</h3>
            <p>This thing is purpose-built for exactly what most of us do inside an IDE all day. Long-horizon agent sessions, tool use, file editing, terminal work. It's fast, cheap as hell in the context of ${dual('cursor', 'Cursor')} usage, and genuinely strong. Many people are using it as their default daily driver and only switching up when things get really hard.</p>
          </div>
          <p>A third lane worth knowing: <strong>${dual('kiloCode', 'Kilo Code')}</strong> on ${dual('kiloGateway', 'Kilo Gateway')} free models or cheap BYOK — covered in our <a href="${L.kiloArticle}" rel="noopener">Kilo setup article</a> if you want professional agent work without a ${dual('cursor', 'Cursor')} subscription.</p>

          <h2>My actual recommendation (after burning the money)</h2>
          <p>If you want to use agents sustainably — not just for a week until the credit card bill hits — do this:</p>
          <ol>
            <li><strong>Daily driver:</strong> ${dual('minimax', 'MiniMax M3')} or ${dual('cursor', 'Cursor')} Composer 2.5 (non-thinking). These two will handle the vast majority of real work at a price that doesn't make you cry at the end of the month.</li>
            <li><strong>When it actually matters:</strong> Flip to ${ext('claude', 'Claude Opus')} (or whatever the current top Anthropic model is).</li>
          </ol>
          <p>I'll say it plainly — right now Anthropic still makes the models that feel the most "magical" on really difficult programming problems. The code quality, the reasoning, the taste… it's often a step above. And for those moments? Worth it.</p>
          <p>But using it for everything is financial masochism unless you're already rich or your company is footing the bill without questions.</p>
          <p>Check the leaderboards and prices regularly on <a href="${L.banalModels}" rel="noopener">Banal</a> and ${dual('openrouter', 'OpenRouter')}. Things move stupidly fast. What's the best value today might get dethroned next month by something even cheaper and stronger.</p>

          <h2>The bigger picture</h2>
          <p>The corporate line is always "just use the cheap one, it's fine."</p>
          <p>The actual truth is more nuanced: the cheap ones are fine for most things now — shockingly so. But the absolute best models are still meaningfully better at the hardest stuff.</p>
          <p>The winning strategy isn't "use only the expensive one" or "use only the cheap one."</p>
          <p><strong>It's intelligent switching based on the actual difficulty of the task.</strong></p>
          <p>You don't have to choose between having jaw-dropping agents and keeping your sanity (and money). You just have to stop listening to people who've never actually run serious agent workloads themselves.</p>
          <p>The tools are finally good enough that you can have both.</p>
          <p>You just have to be honest about the economics.</p>
          <p>That's it. No fluff. No "synergize your AI transformation journey." Just the real story, from someone who's paid the stupid tax so you don't have to.</p>
${toolsSection(
  'Tools mentioned',
  `Official sites plus matching entries in our <a href="${L.banalTools}" rel="noopener">tools directory</a> (no affiliate links).`,
  [
    `${dual('cursor', 'Cursor')} — IDE + Composer 2.5`,
    `${dual('claudeCode', 'Claude Code')} / ${ext('anthropic', 'Anthropic API')} — top-tier reasoning`,
    `${dual('minimax', 'MiniMax M3')} — daily-driver value`,
    `${dual('openrouter', 'OpenRouter')} — price shopping + routing`,
    `${dual('kiloCode', 'Kilo Code')} — free/cheap agent lane`,
    `${dual('antigravity', 'Google Antigravity')} — heavy planning sessions`,
    `<a href="${L.banalModels}" rel="noopener">Banal AI models panel</a> — verify prices before you budget`,
  ]
)}`;

const agentsJa = `
          <h1>2026年のAIコーディングエージェントの本当のコスト</h1>
          <p class="article-meta">〜「数百ドル燃やす」か「賢く使って持続可能にする」か〜</p>
          <hr />
          <p>聞いてくれ。俺はもう何千時間も、何千ドルもこれらのツールに突っ込んできた。スーツ着たマネージャーたちが「${dual('cursor', 'Cursor')}の20ドルライセンス買えば十分だろ」と言いながら、次の瞬間には「大事なときはOpus使えよ」と言うのを見てきた。</p>
          <p>全部、綺麗事だ。</p>
          <p>現実を話すと、本物のエージェントをガチで使おうとすると（アプリ全体をテストして、スクリーンショット撮って、バグ直して、ターミナル操作して、最後に「全部大丈夫です、ダークモードも勝手に追加しときました」ってメールまで送ってくるようなやつ）、トップモデルの請求書は簡単に<strong>月200〜400ドル超える</strong>。50ドルとか100ドルとかじゃない。本気で何時間も使ったら、普通にそのくらい行く。</p>
          <p>理由はシンプル。<strong>エージェントのワークフローは出力トークンがバカみたいに多い</strong>。コード生成、思考トレース、ツール呼び出し、修正ループ…全部出力だ。そこが一番高い。</p>

          <h2>実際の数字</h2>
          <p>${ext('claude', 'Claude Opus')}（${ext('anthropic', 'Anthropic')}現行世代）だと、だいたい<strong>入力500万トークンで5ドル、出力で25ドル</strong>くらい（予算前に<a href="${L.banalModels}" rel="noopener">Banalのモデル一覧</a>で確認を）。</p>
          <p>${dual('cursor', 'Cursor')}、${dual('claudeCode', 'Claude Code')}、${dual('antigravity', 'Google Antigravity')}などで本気のエージェントセッションを回すと：</p>
          <ul>
            <li>コンテキストデカい</li>
            <li>ツール連打する</li>
            <li>コード何度も出し直す</li>
            <li>スクリーンショット解析（マルチモーダル）</li>
            <li>サマリーやメールまで書く</li>
          </ul>
          <p>請求書が痛いのは当然なんだよ。</p>
          <p>でもここで大事な話がある。80〜90%の作業には、最強モデルは要らないことが多い。</p>

          <h2>コスパがバグってるモデルたち</h2>
          <p>今、フロンティアにかなり近い性能を出しながら、価格が桁違いに安いモデルが出てきてる。</p>
          <p>特に推してるのが <strong>${dual('minimax', 'MiniMax M3')}</strong> だ。</p>
          <div class="model-card">
            <h3>MiniMax M3</h3>
            <ul>
              <li><strong>価格：</strong>入力0.30ドル / 出力1.20ドル（${dual('openrouter', 'OpenRouter')}や${ext('minimax', 'MiniMax')}公式。キャッシュ効かせるとさらに安くなる）</li>
              <li>Opusの出力価格の<strong>16〜20分の1</strong>くらい</li>
              <li><strong>コンテキスト100万トークン</strong></li>
              <li><strong>ネイティブマルチモーダル</strong>（画像も動画もそのまま理解）</li>
              <li>コーディング・エージェント系のリーダーボード（<a href="${L.artificialAnalysis}" rel="noopener noreferrer">Artificial Analysis</a>、<a href="${L.codeArena}" rel="noopener noreferrer">Code Arena</a>など）でトップ勢にかなり近い。完璧に同じじゃないけど、日常使いで20倍の価値があるか？ほとんどのケースでNo。</li>
            </ul>
          </div>
          <p>あと <strong>${dual('cursor', 'Cursor')}のComposer 2.5</strong>（Thinkingオフの速い方）もめちゃくちゃ強い。</p>
          <div class="model-card">
            <h3>Cursor Composer 2.5（高速版）</h3>
            <p>Cursorの中で長時間エージェントを回すために作られてる感じで、ファイル編集・ツール使用・ターミナル作業が上手い。価格もCursorユーザーからするとバカみたいに安くて、日常使いの主力に据えてる人が増えてる。</p>
          </div>
          <p>3つ目のレーン：<strong>${dual('kiloCode', 'Kilo Code')}</strong>＋${dual('kiloGateway', 'Kilo Gateway')}の無料/BYOKルート。${dual('cursor', 'Cursor')}課金なしで本気のエージェント作業をしたいなら<a href="${L.kiloArticle}" rel="noopener">Kilo記事</a>を参照。</p>

          <h2>俺が実際にやってる運用（金と時間を無駄にした後）</h2>
          <p>正直に言うと、こうしてる：</p>
          <ol>
            <li><strong>普段使い（8〜9割）：</strong>${dual('minimax', 'MiniMax M3')} か ${dual('cursor', 'Cursor')} Composer 2.5（非Thinking）。</li>
            <li><strong>本気で難しいときだけ：</strong>${ext('claude', 'Claude Opus')}（またはその時点の最強Anthropicモデル）に切り替える。</li>
          </ol>
          <p>Anthropicのモデルは、今でも「難しいプログラミングの問題」で一番「魔法みたい」と感じることが多い。コードの質、センス、推論の深さで、まだ一歩リードしてる部分があると思う。</p>
          <p>でもそれを全部に使うのは、金に余裕がある人か、会社が無制限に払ってくれる人だけにしとけ。</p>
          <p>リーダーボードと価格は<a href="${L.banalModels}" rel="noopener">Banal</a>と${dual('openrouter', 'OpenRouter')}で定期的に確認した方がいい。状況がバカみたいに速く変わるから。</p>

          <h2>最後に</h2>
          <p>大事なのは「一番高いモデルだけ使う」でも「一番安いモデルだけ使う」でもない。</p>
          <p><strong>タスクの難易度に応じて賢く切り替えること</strong>だ。</p>
          <p>本気でエージェントを使い続けたいなら、結局これが一番持続可能なやり方だと思う。</p>
          <p>綺麗事抜きで。実際に金と時間を無駄にした人間からの、リアルな話だ。</p>
${toolsSection(
  '掲載ツール一覧',
  `<a href="${L.banalTools}" rel="noopener">ツール一覧</a>での該当エントリ（アフィリエイトリンクなし）。`,
  [
    `${dual('cursor', 'Cursor')} + Composer 2.5`,
    `${dual('claudeCode', 'Claude Code')} / Anthropic API`,
    `${dual('minimax', 'MiniMax M3')}`,
    `${dual('openrouter', 'OpenRouter')}`,
    `${dual('kiloCode', 'Kilo Code')}`,
    `${dual('antigravity', 'Google Antigravity')}`,
    `<a href="${L.banalModels}" rel="noopener">Banal AIモデル一覧</a>`,
  ]
)}`;

function replaceLangBlock(html, lang, content) {
  if (lang === 'en') {
    return html.replace(
      /(<div data-lang-only="en">)[\s\S]*?(\n        <div data-lang-only="ja" hidden>)/,
      `$1${content}$2`
    );
  }
  return html.replace(
    /(<div data-lang-only="ja" hidden>)[\s\S]*?(\n        <\/div>\n      <\/article>)/,
    `$1${content}$2`
  );
}

function patchArticle(slug, en, ja) {
  const file = path.join(root, 'articles', slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  html = replaceLangBlock(html, 'en', en);
  html = replaceLangBlock(html, 'ja', ja);
  fs.writeFileSync(file, html);
  console.log('linked', slug);
}

patchArticle('free-ai-coding-setup-2026', kiloEn, kiloJa);
patchArticle('honest-truth-ai-coding-agents-2026', agentsEn, agentsJa);
