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
  minimax: { ext: 'https://www.minimax.io/', banal: banal('MiniMax') },
  kimi: { ext: 'https://kimi.moonshot.cn/', banal: banal('Kimi') },
  glm: { ext: 'https://huggingface.co/zai-org/GLM-5' },
  nvidia: { ext: 'https://build.nvidia.com/' },
  poolside: { ext: 'https://poolside.ai/' },
  stepfun: { ext: 'https://www.stepfun.com/' },
  banalTools: '../../#ai-tools',
  banalModels: '../../#ai-models',
  kiloArticle: '../free-ai-coding-setup-2026/',
  agentsArticle: '../honest-truth-ai-coding-agents-2026/',
};

function ext(key, label) {
  return `<a href="${L[key].ext}" rel="noopener noreferrer">${label}</a>`;
}

/** Official link + subtle Banal listing ref (no inline "(Banal)" noise). */
function dual(key, label) {
  const item = L[key];
  const a = ext(key, label);
  if (!item?.banal) return a;
  return `${a}<a href="${item.banal}" class="article-banal-ref" rel="noopener" aria-label="${label} on Banal" title="Banal listing"><span aria-hidden="true">↗</span></a>`;
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

function agentsPriceTableEn() {
  return `
          <div class="article-table-wrap">
            <table class="article-table">
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">Input per 1M tokens</th>
                  <th scope="col">Output per 1M tokens</th>
                  <th scope="col">Approx. vs Claude Opus 4.8</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${dual('minimax', 'MiniMax M3')}</strong></td>
                  <td>$0.30</td>
                  <td><strong>$1.20</strong></td>
                  <td>~20× cheaper on output</td>
                </tr>
                <tr>
                  <td><strong>${dual('cursor', 'Cursor')} Composer 2.5</strong> (Standard, non-Thinking)</td>
                  <td>$0.50</td>
                  <td><strong>$2.50</strong></td>
                  <td>~10× cheaper on output</td>
                </tr>
                <tr>
                  <td>Claude Opus 4.8</td>
                  <td>$5.00</td>
                  <td>$25.00</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>`;
}

function agentsPriceTableJa() {
  return `
          <div class="article-table-wrap">
            <table class="article-table">
              <thead>
                <tr>
                  <th scope="col">モデル</th>
                  <th scope="col">入力（100万トークンあたり）</th>
                  <th scope="col">出力（100万トークンあたり）</th>
                  <th scope="col">Claude Opus 4.8 との比較</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${dual('minimax', 'MiniMax M3')}</strong></td>
                  <td>$0.30</td>
                  <td><strong>$1.20</strong></td>
                  <td>出力で約20倍安い</td>
                </tr>
                <tr>
                  <td><strong>${dual('cursor', 'Cursor')} Composer 2.5</strong> (Standard, non-Thinking)</td>
                  <td>$0.50</td>
                  <td><strong>$2.50</strong></td>
                  <td>出力で約10倍安い</td>
                </tr>
                <tr>
                  <td>Claude Opus 4.8</td>
                  <td>$5.00</td>
                  <td>$25.00</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>`;
}

const kiloEn = `
          <h1>Kilo Code: Professional AI Agent Coding for Free (or Very Cheap) — Without Feeling Left Behind</h1>
          <hr />
          <p>In 2026, AI coding tools have come a long way. A couple of years ago you couldn't really trust them with serious application work. Today, with the right agent setup, you <em>can</em> build, refactor and maintain real projects. The bottleneck is no longer raw capability. It's <strong>cost and access</strong>.</p>
          <p>The very best models (latest ${ext('claude', 'Claude Opus')}, top-tier Sonnet, GPT-5.5 etc.) get expensive fast when you use them properly with agents every day. ${dual('cursor', 'Cursor')} Pro/Ultra or direct ${ext('anthropic', 'Anthropic')} API keys quickly run into serious money. For freelancers, people whose life situation changed, or anyone who's just starting to earn from AI-assisted development, that's simply not realistic.</p>
          <p>This is where <strong>${dual('kiloCode', 'Kilo Code')}</strong> changes things.</p>

          <h2>What is Kilo Code?</h2>
          <p>It's an open-source (Apache 2.0) AI coding agent that installs as a normal extension in your existing <strong>${ext('vscode', 'VS Code')} or ${ext('jetbrains', 'JetBrains')} IDE</strong> (plus a CLI version). You don't have to switch to a forked editor like ${dual('cursor', 'Cursor')}. You keep all your extensions, shortcuts and workflow.</p>
          <p>It has proper agent modes: Code, Plan, Debug, Architect, and Orchestrator (the last one breaks big tasks into specialist sub-agents — genuinely useful). It supports 500+ models from 60+ providers with <strong>zero markup</strong> — you pay the provider's exact price, nothing extra.</p>

          <h2>The free tier — can you actually work professionally on it?</h2>
          <p><strong>Yes.</strong> This is the part most tools get wrong.</p>
          <p>Kilo's Gateway offers genuinely usable free models right now:</p>
          <ul>
            <li><strong>${ext('poolside', 'Laguna M.1')} (Poolside)</strong> — one of the most used models in real agent workflows (Code, Plan, Debug)</li>
            <li><strong>${ext('nvidia', 'Nemotron 3 Ultra')} (NVIDIA)</strong> — strong performer in both benchmarks and daily use</li>
            <li><strong>${ext('stepfun', 'StepFun Step 3.7 Flash')}</strong> and various MiniMax / GLM / Kimi free variants (availability rotates)</li>
            <li><code>kilo-auto/free</code> — automatically picks the best available free model for your session</li>
          </ul>
          <p>There <em>is</em> a rate limit (roughly <strong>200 requests per hour per IP</strong> for anonymous users). In practice, many developers are using this every day for real work. The models are slower than the absolute latest frontier ones and sometimes need clearer guidance or task splitting, but they deliver professional results. You can actually spend full days working with agents without hitting a wall that stops you.</p>
          <p>For comparison: ${dual('cursor', 'Cursor')}'s free Hobby tier gives you about <strong>50 serious premium agent requests + 2000 completions per month</strong>. That's enough to try the tool. It is <strong>not</strong> enough for daily professional agent work. You hit the limit in a single focused session.</p>
          <p>In Kilo on free models you can keep going. It's not "the absolute best possible", but it's <strong>good enough that you don't feel excluded</strong> from modern agentic workflows.</p>

          <h2>How to get better quality without spending a fortune</h2>
          <ol>
            <li><strong>Add your own API keys (Bring Your Own Key)</strong><br />In Kilo this is simple and works for both agents and autocomplete.<br /><strong>${dual('minimax', 'MiniMax')}</strong> models (M2.x / V3) currently offer excellent price/performance — you can get noticeably faster and stronger results for roughly <strong>$10–30/month</strong>. ${dual('deepseek', 'DeepSeek')}, certain Qwen and GLM variants are also strong value. You stay in full control and only pay for what you actually use.</li>
            <li><strong>Cursor route (if you prefer the polished feel)</strong><br />If you like ${dual('cursor', 'Cursor')}'s experience, get their Pro plan ($20/month) and use their Composer 2.5 (not the Fast/Haiku version) or add a cheap ${dual('minimax', 'MiniMax')} key. Still far cheaper than burning top-tier tokens constantly.</li>
            <li><strong>${dual('antigravity', 'Google Antigravity')} CLI as a powerful complement</strong><br />${dual('antigravity', 'Google Antigravity')} gives you very capable autonomous agents that can plan, execute code in a sandbox, browse, etc. Their preview/free tiers often have generous enough quotas for heavy planning sessions.<br />Use it occasionally for complex architecture or big-picture planning with strong reasoning, then take that plan and execute/refine it in Kilo on free or low-cost models. Excellent combo when you want occasional "high-end" thinking without paying high-end prices every day.</li>
          </ol>

          <h2>Honest truth (no marketing fluff)</h2>
          <p>Free models in Kilo will not feel exactly like running the latest Opus on every token. You'll sometimes need to steer the agent more, break tasks down, or switch models. The "magic" is a bit less automatic.</p>
          <p>But the gap is smaller than the big companies want you to believe. With decent prompting, good rules/skills setup, and Kilo's Orchestrator, the productivity jump over working without agents is massive. You can build real features, ship things, learn advanced workflows, and keep up.</p>
          <p>Most importantly: <strong>you don't get left behind</strong>. You can learn and use modern agentic development <em>today</em>, build a portfolio, take on paid work, and earn. When money starts coming in, you can smoothly add $20–40/month and suddenly have very fast, high-quality models (in Kilo or Cursor). No dramatic jump required.</p>

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
${toolsSection(
  'Tools mentioned',
  `Matching entries in our <a href="${L.banalTools}" rel="noopener">tools directory</a>.`,
  [
    `${ext('kiloCode', 'Kilo Code')} — AI coding agent`,
    `${ext('kiloGateway', 'Kilo Gateway')} — model routing`,
    `${ext('vscode', 'VS Code')} / ${ext('jetbrains', 'JetBrains')}`,
    `${ext('cursor', 'Cursor')} — comparison`,
    `${ext('antigravity', 'Google Antigravity')}`,
    `${ext('minimax', 'MiniMax')}, ${ext('deepseek', 'DeepSeek')}, ${ext('openrouter', 'OpenRouter')}`,
    `<a href="${L.kiloLeaderboard.ext}" rel="noopener noreferrer">Kilo leaderboard</a>`,
  ]
)}`;

const kiloJa = `
          <h1>Kilo Code：AIエージェントを使った本格的なプログラミングを無料（または格安）で — 取り残されることなく</h1>
          <hr />
          <p>2026年現在、AIによるコーディングツールは大きく進化しました。数年前までは、本格的なアプリケーション開発を任せるのは現実的ではありませんでした。しかし今は、適切なエージェントの使い方をすれば、実際に構築・リファクタリング・保守ができるレベルになっています。問題は「AIができるかどうか」ではなく、「いくらかかるか」と「誰が使えるか」です。</p>
          <p>最高峰のモデル（最新の${ext('claude', 'Claude Opus')}、トップクラスのSonnet、GPT-5.5など）は、エージェントを毎日本気で使えばすぐに高額になります。${dual('cursor', 'Cursor')}のPro/Ultraプランや${ext('anthropic', 'Anthropic')}への直接課金は、あっという間に大きな金額になります。フリーランスの人、生活環境が変わった人、AIを活用した開発で稼ぎ始めたばかりの人にとっては、現実的ではありません。</p>
          <p>ここで登場するのが <strong>${dual('kiloCode', 'Kilo Code')}</strong> です。</p>

          <h2>Kilo Codeとは？</h2>
          <p>Apache 2.0のオープンソースAIコーディングエージェントで、<strong>既存の${ext('vscode', 'VS Code')}や${ext('jetbrains', 'JetBrains')} IDEに普通の拡張機能としてインストール</strong>できます（CLI版もあり）。${dual('cursor', 'Cursor')}のようにVS Codeのフォークに乗り換える必要はありません。今の環境のまま、すべての拡張機能・ショートカット・ワークフローをそのまま使えます。</p>
          <p>エージェントモードも充実しています：Code、Plan、Debug、Architect、Orchestrator（最後のOrchestratorは大きなタスクを専門のサブエージェントに分解してくれる非常に実用的な機能です）。60以上のプロバイダーから500以上のモデルをサポートし、<strong>ゼロマークアップ</strong>（Kiloが上乗せせず、プロバイダーのそのままの料金で利用可能）です。</p>

          <h2>無料プランで本当に本格的に働けるのか？</h2>
          <p><strong>はい。</strong>これがほとんどのツールが苦手とする部分です。</p>
          <p>KiloのGatewayでは、現在実用レベルの無料モデルが使えます：</p>
          <ul>
            <li><strong>${ext('poolside', 'Laguna M.1')}（Poolside）</strong> — 実際のエージェントワークフロー（Code、Plan、Debug）で最も使われているモデルの一つ</li>
            <li><strong>${ext('nvidia', 'Nemotron 3 Ultra')}（NVIDIA）</strong> — ベンチマークと日常使いの両方で強いパフォーマンス</li>
            <li><strong>${ext('stepfun', 'StepFun Step 3.7 Flash')}</strong> や MiniMax / GLM / Kimi の無料版（利用可能状況は変動します）</li>
            <li><code>kilo-auto/free</code> — そのセッションで最も適した無料モデルを自動で選んでくれる</li>
          </ul>
          <p>レートリミットは存在します（匿名ユーザーでIPあたり約<strong>200リクエスト/時間</strong>程度）。しかし実際には、多くの開発者がこれを毎日本格的な作業に使っています。最新の最先端モデルよりは遅く、ときどきより明確な指示を出したりタスクを分割したりする必要がありますが、<strong>プロフェッショナルな成果を出せます</strong>。1日中エージェントとやり取りしながら作業を進められるレベルです。</p>
          <p>比較として：${dual('cursor', 'Cursor')}の無料プラン（Hobby）は、<strong>月50回程度のプレミアムエージェントリクエスト＋2000回のコード補完</strong>程度です。これはツールを試すには十分ですが、<strong>日常のプロフェッショナルなエージェント作業には全く足りません</strong>。集中して作業しているとすぐに上限に当たります。</p>
          <p>Kiloの無料モデルなら、ずっと作業を続けられます。「最高峰ではないけど、ちゃんと仕事になる」——これが重要なポイントです。</p>

          <h2>品質を上げたいときの現実的な選択肢</h2>
          <ol>
            <li><strong>自分のAPIキーを追加する（Bring Your Own Key）</strong><br />Kiloでは非常に簡単で、エージェントもオートコンプリートも自分のキーで使えます。<br /><strong>${dual('minimax', 'MiniMax')}</strong>モデル（M2.x / V3系）は現在コスパが非常に良く、月<strong>10〜30ドル</strong>程度で明らかに速くて良い結果が出せます。${dual('deepseek', 'DeepSeek')}、特定のQwenやGLM系も価値が高いです。完全にコントロールでき、実際に使った分だけ支払う形です。</li>
            <li><strong>Cursorを使う場合</strong><br />${dual('cursor', 'Cursor')}の洗練された体験がどうしても欲しいなら、Proプラン（月20ドル）を契約し、Composer 2.5（Fast/Haiku以外）や安い${dual('minimax', 'MiniMax')}キーを組み合わせる方法もあります。それでも最上位モデルを常時使うよりはるかに安上がりです。</li>
            <li><strong>${dual('antigravity', 'Google Antigravity')} CLIとの組み合わせ</strong><br />${dual('antigravity', 'Google Antigravity')}はエージェント特化のCLI/プラットフォームで、プレビューや無料枠で、計画立案・サンドボックスでのコード実行・ウェブ閲覧などが可能な高度なエージェントが使えます。<br />複雑なアーキテクチャ設計や大きな計画立案をAntigravityで一度行い、その計画をKiloに持ち込んで無料〜格安モデルで実装・反復するという使い方が非常に効果的です。高額なモデルを毎日使う必要がなくなります。</li>
          </ol>

          <h2>正直なところ（宣伝抜きで）</h2>
          <p>Kiloの無料モデルは、最新のOpusを毎回使ったときのような「魔法のような」体験はしにくいです。ときどきエージェントをより細かく導いたり、タスクを分割したり、モデルを切り替えたりする必要があります。「魔法」の度合いは少し控えめになります。</p>
          <p>しかし、その差は大企業が宣伝するほど劇的なものではありません。良いプロンプト、しっかりしたルール/スキル設定、そしてKiloのOrchestratorを活用すれば、エージェントなしの作業と比べて<strong>生産性が劇的に向上</strong>します。実際に機能を作り、リリースし、高度なワークフローを学び、キャッチアップできます。</p>
          <p>そして何より大事なのは、<strong>取り残されない</strong>ということです。今日から最新のエージェントワークフローを学び、ポートフォリオを築き、有料の仕事を受注して稼ぐことができます。お金が入り始めたら、月20〜40ドル程度を追加するだけで、かなり高速で高品質なモデルが使えるようになります。急激なジャンプは必要ありません。</p>

          <h2>こんな人におすすめ</h2>
          <ul>
            <li>月100〜200ドル以上をAIトークンに使いたくない人</li>
            <li>今のVS CodeやJetBrains環境を離れたくない人</li>
            <li>透明性（実際に何がモデルに送られているか確認できる）を重視する人</li>
            <li>モデルを選べる自由が欲しい人</li>
          </ul>

          <p>今すぐ試すなら、${dual('kiloCode', 'Kilo Code')}の拡張機能をインストールして、モデルピッカーで「free」と入力し、使えるモデルを選んでみてください。リアルタイムの<a href="${L.kiloLeaderboard.ext}" rel="noopener noreferrer">リーダーボード</a>も参考になります。</p>
          <hr />
          <p><strong>これは「無料で完璧」ではありません。</strong></p>
          <p><strong>「無料で十分に本格的で、ちゃんと前に進める」</strong>ツールです。</p>
          <p>2026年の今、それはすでに非常に大きな価値があります。そして多くの人にとって、「高額な環境が揃うまで待つ」必要なく前に進むために必要なものです。</p>
          <p>試してみてください。何かを作ってみてください。料金表が思わせぶりにするほど、あなたは取り残されているわけではありません。</p>
${toolsSection(
  '掲載ツール一覧',
  `<a href="${L.banalTools}" rel="noopener">ツール一覧</a>での該当エントリ。`,
  [
    `${ext('kiloCode', 'Kilo Code')}`,
    `${ext('kiloGateway', 'Kilo Gateway')}`,
    `${ext('vscode', 'VS Code')} / ${ext('jetbrains', 'JetBrains')}`,
    `${ext('cursor', 'Cursor')}`,
    `${ext('antigravity', 'Google Antigravity')}`,
    `${ext('minimax', 'MiniMax')}、${ext('deepseek', 'DeepSeek')}、${ext('openrouter', 'OpenRouter')}`,
    `<a href="${L.kiloLeaderboard.ext}" rel="noopener noreferrer">Kiloリーダーボード</a>`,
  ]
)}`;

const agentsEn = `
          <h1>The Honest Truth About AI Coding Agents in 2026</h1>
          <p class="article-meta">(Or: How I stopped burning hundreds of dollars a month and still get shit done)</p>
          <hr />
          <p>Listen. I've burned through thousands of dollars and thousands of hours with these things. I've worked in places where managers in suits tell you "just buy the $20 ${dual('cursor', 'Cursor')} license and use whatever's cheap, bro." Then in the next breath they're like "make sure you use Opus for the important stuff."</p>
          <p>It's pure corporate theater.</p>
          <p>The reality? If you actually want to use real agents — the kind that spin up, test your whole app, take screenshots of the UI, fix bugs, run terminal commands, and then casually email you "hey, everything looks good, I even added the dark mode you forgot about" — the top models will happily eat <strong>hundreds of dollars a month</strong>. Not $50. Not $100. We're talking <strong>$200–400+</strong> if you're using them properly for real work, multiple hours a day.</p>
          <p>Because here's the dirty little secret nobody in those meetings wants to say out loud: <strong>output tokens are expensive as hell</strong>, and agent workflows are output-heavy. Every iteration, every code block, every reasoning trace, every tool call… it adds up fast.</p>

          <h2>The uncomfortable math</h2>
          <p>Take ${ext('claude', 'Claude Opus')} (current generation). You're looking at roughly <strong>$5 per million input tokens</strong> and <strong>$25 per million output tokens</strong>.</p>
          <p>Now run a proper agent session:</p>
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
          <p>This is where it gets interesting.</p>
          <p>Right now there are models that are shockingly close to the frontier on coding and agentic tasks while costing a fraction of the price. Two standouts right now are <strong>${dual('minimax', 'MiniMax M3')}</strong> and <strong>${dual('cursor', 'Cursor')}'s own Composer 2.5</strong> (Standard / non-Thinking mode).</p>

          <h3>Head-to-head price comparison (official rates, June 2026)</h3>
${agentsPriceTableEn()}
          <p>Both of these are in a completely different league price-wise compared to Opus. MiniMax M3 edges it out slightly on raw per-token cost and has native multimodal + 1M context out of the box. Composer 2.5 (Standard) is a bit more expensive per token but is deeply optimized for long agentic sessions inside Cursor and feels extremely snappy for daily work.</p>
          <p>The key takeaway: both are excellent daily drivers. You're looking at roughly <strong>10–20× lower cost</strong> than using Opus for the same kind of heavy agent usage. That's the difference between "I can actually afford to use agents every day" and "fuck, the bill again."</p>

          <h2>My actual recommendation (after burning the money)</h2>
          <p>If you want to use agents sustainably — not just for a week until the credit card bill hits — do this:</p>
          <ol>
            <li><strong>Daily driver:</strong> ${dual('minimax', 'MiniMax M3')} or ${dual('cursor', 'Cursor')} Composer 2.5 (Standard / non-Thinking). These two will handle the vast majority of real work at a price that doesn't make you cry at the end of the month.</li>
            <li><strong>When it actually matters:</strong> Flip to ${ext('claude', 'Claude Opus')} (or whatever the current top Anthropic model is).<br />I'll say it plainly — right now Anthropic still makes the models that feel the most "magical" on really difficult programming problems. The code quality, the reasoning, the taste… it's often a step above. And for those moments? Worth it.<br />But using it for everything is financial masochism unless you're already rich or your company is footing the bill without questions.</li>
            <li><strong>Check the leaderboards and prices regularly.</strong> Things move stupidly fast. What's the best value today might get dethroned next month by something even cheaper and stronger.</li>
          </ol>

          <h2>The bigger picture</h2>
          <p>The corporate line is always "just use the cheap one, it's fine."</p>
          <p>The actual truth is more nuanced: the cheap ones are fine for most things now — shockingly so. But the absolute best models are still meaningfully better at the hardest stuff.</p>
          <p>The winning strategy isn't "use only the expensive one" or "use only the cheap one."</p>
          <p><strong>It's intelligent switching based on the actual difficulty of the task.</strong></p>
          <p>You don't have to choose between having jaw-dropping agents and keeping your sanity (and money). You just have to stop listening to people who've never actually run serious agent workloads themselves.</p>
          <p>The tools are finally good enough that you can have both.</p>
          <p>You just have to be honest about the economics.</p>
          <p>That's it. No fluff. No "synergize your AI transformation journey." Just the real shit, from someone who's paid the stupid tax so you don't have to.</p>
${toolsSection(
  'Tools mentioned',
  `Matching entries in our <a href="${L.banalTools}" rel="noopener">tools directory</a> and <a href="${L.banalModels}" rel="noopener">models panel</a>.`,
  [
    `${ext('cursor', 'Cursor')} — Composer 2.5`,
    `${ext('claudeCode', 'Claude Code')} / ${ext('anthropic', 'Anthropic')}`,
    `${ext('minimax', 'MiniMax M3')}`,
    `${ext('openrouter', 'OpenRouter')}`,
    `${ext('kiloCode', 'Kilo Code')}`,
    `<a href="${L.banalModels}" rel="noopener">Banal models panel</a>`,
  ]
)}`;

const agentsJa = `
          <h1>2026年のAIエージェントの本当のコスト</h1>
          <p class="article-meta">〜「数百ドル燃やす」か「賢く使って持続可能にする」か〜</p>
          <hr />
          <p>聞いてくれ。俺はもう何千時間も、何千ドルもこれらのツールに突っ込んできた。スーツ着たマネージャーたちが「${dual('cursor', 'Cursor')}の20ドルライセンス買えば十分だろ」と言いながら、次の瞬間には「大事なときはOpus使えよ」と言うのを見てきた。</p>
          <p>全部、綺麗事だ。</p>
          <p>現実を話すと、本物のエージェントをガチで使おうとすると（アプリ全体をテストして、スクリーンショット撮って、バグ直して、ターミナル操作して、最後に「全部大丈夫です、ダークモードも勝手に追加しときました」ってメールまで送ってくるようなやつ）、トップモデルの請求書は簡単に<strong>月200〜400ドル超える</strong>。50ドルとか100ドルとかじゃない。本気で何時間も使ったら、普通にそのくらい行く。</p>
          <p>理由はシンプル。エージェントのワークフローは<strong>出力トークンがバカみたいに多い</strong>。コード生成、思考トレース、ツール呼び出し、修正ループ…全部出力だ。そこが一番高い。</p>

          <h2>実際の数字</h2>
          <p>${ext('claude', 'Claude Opus')}（現行世代）だと、だいたい <strong>入力500万トークンで5ドル、出力で25ドル</strong> くらい。</p>
          <p>これで本気のエージェントセッション回したら、どうなるか想像できるだろ。コンテキストデカいし、ツール連打するし、コード何度も出し直すし。請求書が痛いのは当然なんだよ。</p>
          <p>でもここで大事な話がある。</p>

          <h2>コスパがバグってるモデルたち</h2>
          <p>今、フロンティアにかなり近い性能を出しながら、価格が桁違いに安いモデルが出てきてる。特に目立ってるのが <strong>${dual('minimax', 'MiniMax M3')}</strong> と <strong>${dual('cursor', 'Cursor')} 純正の Composer 2.5</strong>（Standard / non-Thinkingモード）だ。</p>

          <h3>価格比較（公式ドキュメント準拠、2026年6月時点）</h3>
${agentsPriceTableJa()}
          <p>どちらも Opus に比べると完全に別次元の価格帯だ。MiniMax M3 の方がトークン単価ではやや安く、マルチモーダルと100万コンテキストが最初から強い。Composer 2.5（Standard）は少し単価が高いけど、Cursor IDE内での長時間エージェント作業に最適化されていて、日常使いの体感速度が非常に良い。</p>
          <p>大事なポイントは、どちらも「毎日ガッツリ使っても財布が死なない」レベルだということ。Opus で同じ量のエージェント作業をやると比べて、<strong>10〜20倍くらい安く</strong>済む。これが「毎日エージェントを使えるかどうか」の分水嶺になる。</p>

          <h2>俺が実際にやってる運用（金と時間を無駄にした後）</h2>
          <p>正直に言うと、こうしてる：</p>
          <ul>
            <li><strong>普段使い（8〜9割）：</strong>${dual('minimax', 'MiniMax M3')} か ${dual('cursor', 'Cursor')} Composer 2.5（Standard / non-Thinking）。これで十分に「エージェントがヤバい」体験ができる。</li>
            <li><strong>本気で難しいときだけ：</strong>${ext('claude', 'Claude Opus')}（またはその時点の最強Anthropicモデル）に切り替える。</li>
          </ul>
          <p>Anthropicのモデルは、今でも「難しいプログラミングの問題」で一番「魔法みたい」と感じることが多い。コードの質、センス、推論の深さで、まだ一歩リードしてる部分があると思う。</p>
          <p>でもそれを全部に使うのは、金に余裕がある人か、会社が無制限に払ってくれる人だけにしとけ。</p>

          <h2>最後に</h2>
          <p>リーダーボードと価格は定期的に確認した方がいい。状況がバカみたいに速く変わるから。</p>
          <p>大事なのは「一番高いモデルだけ使う」でも「一番安いモデルだけ使う」でもない。<strong>タスクの難易度に応じて賢く切り替えること</strong>だ。</p>
          <p>本気でエージェントを使い続けたいなら、結局これが一番持続可能なやり方だと思う。</p>
          <p>綺麗事抜きで。実際に金と時間を無駄にした人間からの、リアルな話だ。</p>
${toolsSection(
  '掲載ツール一覧',
  `<a href="${L.banalTools}" rel="noopener">ツール一覧</a>と<a href="${L.banalModels}" rel="noopener">モデル一覧</a>。`,
  [
    `${ext('cursor', 'Cursor')} + Composer 2.5`,
    `${ext('claudeCode', 'Claude Code')} / ${ext('anthropic', 'Anthropic')}`,
    `${ext('minimax', 'MiniMax M3')}`,
    `${ext('openrouter', 'OpenRouter')}`,
    `${ext('kiloCode', 'Kilo Code')}`,
    `<a href="${L.banalModels}" rel="noopener">Banal モデル一覧</a>`,
  ]
)}`;

function patchArticle(slug, en, ja) {
  const file = path.join(root, 'articles', slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(
    /<div data-lang-only="en">[\s\S]*?\n      <\/article>/,
    `<div data-lang-only="en">${en}\n        <div data-lang-only="ja" hidden>${ja}\n        </div>\n      </article>`
  );
  fs.writeFileSync(file, html);
  console.log('linked', slug);
}

patchArticle('free-ai-coding-setup-2026', kiloEn, kiloJa);
patchArticle('honest-truth-ai-coding-agents-2026', agentsEn, agentsJa);
