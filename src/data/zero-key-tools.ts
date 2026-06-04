/**
 * Zero-Key Power Tools - a practical arsenal for people with no budget.
 *
 * Curation rules:
 * - Prefer tools that are genuinely useful today: mature OSS, known public APIs,
 *   reliable no-login web tools, or generous free tiers with no credit-card trap.
 * - Separate surfaces because "free" means different things:
 *   web = open in a browser, api = program against it, cli = install/run locally.
 * - Keep caveats explicit. Poor users and solo developers do not need hype; they
 *   need the limits before the limits hurt them.
 */

export type ZeroKeySurface = 'web' | 'api' | 'cli';

export type ZeroKeyCategory =
  | 'ai-assistants'
  | 'ai-image'
  | 'ai-video'
  | 'ai-audio'
  | 'ai-writing'
  | 'ai-search'
  | 'ai-pdf'
  | 'ai-presentation'
  | 'ai-math'
  | 'coding-devtools'
  | 'docs-knowledge'
  | 'public-data'
  | 'design-media'
  | 'backend-infra'
  | 'automation-ops'
  | 'security-privacy'
  | 'productivity'
  | 'learning-career';

export interface ZeroKeyTool {
  id: string;
  name: string;
  url: string;
  surface: ZeroKeySurface;
  category: ZeroKeyCategory;
  access: 'no-login' | 'public-api' | 'open-source' | 'free-tier' | 'self-host';
  badges: string[];
  bestFor: string;
  qualityNote: string;
  caveat?: string;
}

export const surfaceLabels: Record<ZeroKeySurface, string> = {
  web: 'Free Web',
  api: 'Free API',
  cli: 'Free CLI',
};

export const categoryLabels: Record<ZeroKeyCategory, string> = {
  'ai-assistants': 'AI help that actually works',
  'ai-image': 'AI image generation & editing',
  'ai-video': 'AI video generation & editing',
  'ai-audio': 'AI audio, music, voice & TTS',
  'ai-writing': 'AI writing, summarization & translation',
  'ai-search': 'AI search & research engines',
  'ai-pdf': 'AI document & PDF tools',
  'ai-presentation': 'AI presentations & slides',
  'ai-math': 'AI math, science & education',
  'coding-devtools': 'Coding and developer workflow',
  'docs-knowledge': 'Docs, research, and knowledge',
  'public-data': 'Public data and open datasets',
  'design-media': 'Design, images, audio, and video',
  'backend-infra': 'Backend, hosting, databases',
  'automation-ops': 'Automation, ops, monitoring',
  'security-privacy': 'Security and privacy',
  productivity: 'Life admin and productivity',
  'learning-career': 'Learning and career leverage',
};

export const zeroKeyTools: ZeroKeyTool[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // AI ASSISTANTS & CHAT
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'duck-ai',
    name: 'Duck.ai',
    url: 'https://duck.ai/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'no-login',
    badges: ['private', 'no signup', 'multi-model'],
    bestFor: 'Private everyday chat, letters, plans, explanations, and sensitive drafting.',
    qualityNote:
      'DuckDuckGo puts strong hosted models behind a privacy-first chat surface with no account friction.',
    caveat: 'Do not treat any hosted AI as confidential legal, medical, or financial counsel.',
  },
  {
    id: 'lmarena',
    name: 'LMArena',
    url: 'https://lmarena.ai/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'no-login',
    badges: ['model comparison', 'research-grade', 'free'],
    bestFor: 'Comparing model answers when quality matters more than speed.',
    qualityNote:
      'The Arena ecosystem is one of the best public ways to test many capable models against the same prompt.',
  },
  {
    id: 'webllm-chat',
    name: 'WebLLM Chat',
    url: 'https://chat.webllm.ai/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'open-source',
    badges: ['local', 'private', 'WebGPU'],
    bestFor: 'Private AI on a capable laptop or phone without sending text to a server.',
    qualityNote:
      'Runs open models in the browser through WebGPU. This is the strongest privacy story in the web section.',
    caveat: 'Needs modern browser/GPU support and can be slow on old shared machines.',
  },
  {
    id: 'perchance-chat',
    name: 'Perchance AI Chat',
    url: 'https://perchance.org/ai-chat',
    surface: 'web',
    category: 'ai-assistants',
    access: 'no-login',
    badges: ['no signup', 'generous', 'simple'],
    bestFor: 'Zero-friction text help when the user cannot make an account.',
    qualityNote:
      'Practical browser chat with very low friction; useful as the emergency fallback tab.',
  },
  {
    id: 'huggingface-spaces',
    name: 'Hugging Face Spaces',
    url: 'https://huggingface.co/spaces',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['community', 'models', 'searchable'],
    bestFor: 'Finding open demos for LLMs, image tools, speech, OCR, and small prototypes.',
    qualityNote:
      'The deepest community lab on the web; excellent if you search by model or task, not random hype.',
    caveat: 'Spaces can sleep, break, rate-limit, or require login depending on the author.',
  },
  {
    id: 'chatgpt-free',
    name: 'ChatGPT Free',
    url: 'https://chatgpt.com/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['GPT-4o-mini', 'popular', 'versatile'],
    bestFor: 'General-purpose AI chat for writing, coding, brainstorming, and learning.',
    qualityNote:
      'The most popular AI chatbot. Free tier gives access to GPT-4o-mini and limited GPT-4o, which handles most everyday tasks well.',
    caveat:
      'Free tier has usage caps that reset periodically. Some features require Plus subscription.',
  },
  {
    id: 'microsoft-copilot',
    name: 'Microsoft Copilot',
    url: 'https://copilot.microsoft.com/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'no-login',
    badges: ['GPT-4', 'no signup', 'web search'],
    bestFor: 'GPT-4 powered chat with web search, image generation, and no account required.',
    qualityNote:
      'One of the best free options because it often runs GPT-4 class models without requiring login. Includes image generation via DALL-E.',
    caveat: 'Microsoft account unlocks more features; conversation limits exist.',
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    url: 'https://gemini.google.com/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['Gemini Pro', 'multimodal', 'Google integration'],
    bestFor:
      'Multimodal AI chat with image understanding, Google ecosystem integration, and long context.',
    qualityNote:
      'Free access to Gemini models with strong reasoning. Excellent for tasks involving images, long documents, and Google Workspace.',
    caveat: 'Requires Google account. Some advanced features limited to paid tiers.',
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    url: 'https://www.meta.ai/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'no-login',
    badges: ['Llama', 'no signup', 'image gen'],
    bestFor: 'Quick AI chat and image generation without creating any account.',
    qualityNote:
      'Powered by Llama models. Offers surprisingly capable chat and image generation with zero friction.',
    caveat: 'Available in limited regions. Quality varies compared to GPT-4 class models.',
  },
  {
    id: 'pi-ai',
    name: 'Pi AI',
    url: 'https://pi.ai/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'no-login',
    badges: ['conversational', 'empathetic', 'no signup'],
    bestFor: 'Warm, conversational AI when you need patient explanations or a thinking partner.',
    qualityNote:
      'Designed specifically for natural conversation. More empathetic and patient than most chatbots, great for brainstorming.',
    caveat: 'Less capable at technical/coding tasks than specialized tools.',
  },
  {
    id: 'grok',
    name: 'Grok',
    url: 'https://x.com/i/grok',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['real-time', 'X integration', 'image gen'],
    bestFor: 'AI chat with real-time information from X/Twitter and image generation.',
    qualityNote:
      'Free tier available via X. Strong at current events and trending topics due to real-time data access.',
    caveat: 'Requires X account. Free tier has daily message limits.',
  },
  {
    id: 'you-com',
    name: 'You.com',
    url: 'https://you.com/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['AI search', 'chat', 'multi-model'],
    bestFor: 'AI-powered search that combines chat, web results, and multiple AI models.',
    qualityNote:
      'Unique hybrid of search engine and AI chat. Free tier lets you switch between different AI models for answers.',
    caveat: 'Some advanced models and features behind paywall.',
  },
  {
    id: 'groq',
    name: 'Groq',
    url: 'https://groq.com/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['ultra-fast', 'open models', 'API'],
    bestFor: 'Lightning-fast inference on open-source models when speed matters most.',
    qualityNote:
      'Custom LPU hardware makes it the fastest way to run Llama, Mixtral, and other open models. Free tier is generous.',
    caveat: 'Rate limits apply. Model selection limited to open-source models.',
  },
  {
    id: 'perplexity-ai',
    name: 'Perplexity AI',
    url: 'https://www.perplexity.ai/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['citations', 'research', 'web search'],
    bestFor: 'Research questions where you need answers with cited sources you can verify.',
    qualityNote:
      'The best free AI search tool for serious research. Every answer includes clickable source citations.',
    caveat: 'Pro Search (more thorough) is limited on free tier. Basic search is unlimited.',
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['powerful', 'coding', 'reasoning'],
    bestFor: 'Powerful AI chat with strong coding and reasoning, competitive with top models.',
    qualityNote:
      'DeepSeek-V3 and R1 models punch well above their weight. Excellent for math, coding, and analytical tasks at zero cost.',
    caveat: 'Requires account. Based in China; consider data residency for sensitive work.',
  },
  {
    id: 'phind',
    name: 'Phind',
    url: 'https://www.phind.com/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['developer', 'code search', 'technical'],
    bestFor: 'Developer-focused AI search that understands code, docs, and technical questions.',
    qualityNote:
      'Built specifically for developers. Searches technical content and generates code-aware answers with sources.',
    caveat: 'Free tier has daily limits on advanced model queries.',
  },
  {
    id: 'mistral-le-chat',
    name: 'Mistral Le Chat',
    url: 'https://chat.mistral.ai/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['Mistral models', 'European', 'capable'],
    bestFor:
      'Free access to Mistral models including the powerful Mistral Large for complex tasks.',
    qualityNote:
      'European AI lab with strong models. Free tier includes access to their full model lineup including canvas and code features.',
    caveat: 'Requires account. Smaller ecosystem than ChatGPT or Gemini.',
  },
  {
    id: 'huggingchat',
    name: 'HuggingChat',
    url: 'https://huggingface.co/chat/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'open-source',
    badges: ['open-source', 'multi-model', 'transparent'],
    bestFor: 'Open-source chat interface with access to the best community models.',
    qualityNote:
      'Run by Hugging Face, the open-source AI hub. Gives free access to top open models like Llama, Mixtral, and Command R+.',
    caveat: 'Requires Hugging Face account. Model availability may change.',
  },
  {
    id: 'poe',
    name: 'Poe',
    url: 'https://poe.com/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['multi-model', 'bots', 'community'],
    bestFor: 'Trying many different AI models and community-built bots from one interface.',
    qualityNote:
      'By Quora. Free tier gives access to GPT-4o-mini, Claude, Gemini, and thousands of custom bots in one place.',
    caveat: 'Free tier has daily message limits per model. Premium models cost credits.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // AI IMAGE GENERATION & EDITING
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'perchance-image',
    name: 'Perchance AI Image',
    url: 'https://perchance.org/ai-text-to-image-generator',
    surface: 'web',
    category: 'ai-image',
    access: 'no-login',
    badges: ['unlimited', 'no signup', 'text-to-image'],
    bestFor: 'Unlimited AI image generation with absolutely no account or cost.',
    qualityNote:
      'One of the rare truly unlimited, no-login image generators. Quality is decent for concepts and illustrations.',
    caveat: 'Image quality below DALL-E/Midjourney level. Best for drafts and experiments.',
  },
  {
    id: 'craiyon',
    name: 'Craiyon',
    url: 'https://www.craiyon.com/',
    surface: 'web',
    category: 'ai-image',
    access: 'no-login',
    badges: ['free', 'text-to-image', 'simple'],
    bestFor: 'Quick text-to-image generation without any account or payment.',
    qualityNote:
      'Formerly DALL-E Mini. Simple interface, generates multiple images per prompt. Good for rapid ideation.',
    caveat: 'Lower quality than premium generators. Has ads on the free tier.',
  },
  {
    id: 'deepai-image',
    name: 'DeepAI Image Generator',
    url: 'https://deepai.org/machine-learning-model/text2img',
    surface: 'web',
    category: 'ai-image',
    access: 'no-login',
    badges: ['no signup', 'API available', 'multiple styles'],
    bestFor: 'Quick image generation with multiple style options and no registration.',
    qualityNote:
      'Offers text-to-image, style transfer, and other visual AI tools without requiring an account.',
    caveat: 'Free tier has watermarks and limited resolution.',
  },
  {
    id: 'pollinations-image',
    name: 'Pollinations Image',
    url: 'https://pollinations.ai/',
    surface: 'web',
    category: 'ai-image',
    access: 'public-api',
    badges: ['open API', 'no key', 'developer-friendly'],
    bestFor: 'Programmatic image generation with a dead-simple API that needs no authentication.',
    qualityNote:
      'Unique in offering both a web UI and a completely open API. Perfect for developers building image features into free apps.',
  },
  {
    id: 'scribble-diffusion',
    name: 'Scribble Diffusion',
    url: 'https://scribblediffusion.com/',
    surface: 'web',
    category: 'ai-image',
    access: 'no-login',
    badges: ['sketch-to-image', 'fun', 'no signup'],
    bestFor: 'Turning rough sketches into polished AI images for brainstorming and fun.',
    qualityNote:
      'A delightful tool that takes your doodles and a text prompt to create refined images. Great for visual ideation.',
  },
  {
    id: 'remove-bg',
    name: 'Remove.bg',
    url: 'https://www.remove.bg/',
    surface: 'web',
    category: 'ai-image',
    access: 'no-login',
    badges: ['background removal', 'instant', 'no signup'],
    bestFor: 'Instantly removing image backgrounds for product photos, profiles, and designs.',
    qualityNote:
      'The gold standard for background removal. Results are immediate and remarkably accurate.',
    caveat: 'Free tier gives lower resolution. Full resolution requires credits or subscription.',
  },
  {
    id: 'cleanup-pictures',
    name: 'Cleanup.Pictures',
    url: 'https://cleanup.pictures/',
    surface: 'web',
    category: 'ai-image',
    access: 'no-login',
    badges: ['object removal', 'inpainting', 'no signup'],
    bestFor: 'Removing unwanted objects, text, or people from photos without Photoshop skills.',
    qualityNote:
      'Brush over anything you want removed and AI fills it in naturally. Surprisingly good results for free.',
    caveat: 'Free tier limits resolution. Complex removals may need multiple passes.',
  },
  {
    id: 'canva-free',
    name: 'Canva Free',
    url: 'https://www.canva.com/',
    surface: 'web',
    category: 'ai-image',
    access: 'free-tier',
    badges: ['design suite', 'templates', 'AI features'],
    bestFor:
      'Creating professional designs, social media graphics, and presentations without design skills.',
    qualityNote:
      'The most accessible design tool for non-designers. Free tier includes AI image generation, templates, and a huge asset library.',
    caveat: 'Best features require Pro subscription. Free tier has watermarked premium assets.',
  },
  {
    id: 'microsoft-designer',
    name: 'Microsoft Designer',
    url: 'https://designer.microsoft.com/',
    surface: 'web',
    category: 'ai-image',
    access: 'free-tier',
    badges: ['DALL-E', 'design', 'templates'],
    bestFor: 'AI-powered graphic design with DALL-E image generation built in.',
    qualityNote:
      'Combines DALL-E image generation with design templates. Generous free tier for social media graphics and visual content.',
    caveat: 'Requires Microsoft account. Daily generation limits apply.',
  },
  {
    id: 'leonardo-ai',
    name: 'Leonardo.ai',
    url: 'https://leonardo.ai/',
    surface: 'web',
    category: 'ai-image',
    access: 'free-tier',
    badges: ['high quality', 'multiple models', 'generous'],
    bestFor: 'High-quality AI image generation with fine-tuned models and daily free credits.',
    qualityNote:
      'Offers 150 daily free tokens, multiple specialized models, and features like image-to-image. Quality rivals paid tools.',
    caveat: 'Requires account. Free tokens refresh daily but run out fast with high-res images.',
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    url: 'https://ideogram.ai/',
    surface: 'web',
    category: 'ai-image',
    access: 'free-tier',
    badges: ['text rendering', 'logos', 'high quality'],
    bestFor:
      'AI images that actually render text correctly — logos, posters, signs, and typography.',
    qualityNote:
      'The best free tool for images containing readable text. Other generators struggle with text; Ideogram excels at it.',
    caveat: 'Requires account. Free tier has daily generation limits.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // AI VIDEO GENERATION
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'capcut',
    name: 'CapCut',
    url: 'https://www.capcut.com/',
    surface: 'web',
    category: 'ai-video',
    access: 'free-tier',
    badges: ['video editor', 'AI features', 'templates'],
    bestFor:
      'Full-featured video editing with AI-powered captions, effects, and background removal.',
    qualityNote:
      'By ByteDance. The best free video editor for short-form content. AI auto-captions alone save hours of work.',
    caveat: 'Some premium templates and effects require Pro. Watermark on some exports.',
  },
  {
    id: 'clipchamp',
    name: 'Clipchamp',
    url: 'https://clipchamp.com/',
    surface: 'web',
    category: 'ai-video',
    access: 'free-tier',
    badges: ['Microsoft', 'browser editor', 'text-to-speech'],
    bestFor: 'Browser-based video editing with Microsoft backing and AI voiceover features.',
    qualityNote:
      'Acquired by Microsoft, now built into Windows. Free tier includes AI text-to-speech, templates, and stock media.',
    caveat: 'Free tier exports at 1080p max. Some stock assets are premium-only.',
  },
  {
    id: 'giz-ai',
    name: 'GizAI',
    url: 'https://giz.ai/',
    surface: 'web',
    category: 'ai-video',
    access: 'free-tier',
    badges: ['text-to-video', 'multiple models', 'image gen'],
    bestFor: 'Experimenting with multiple AI video and image models from a single interface.',
    qualityNote:
      'Aggregates several AI generation models. Useful for comparing outputs and finding what works for your use case.',
    caveat: 'Free tier has limited generations per day. Quality varies by model.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // AI AUDIO, MUSIC, VOICE & TTS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'riffusion',
    name: 'Riffusion',
    url: 'https://www.riffusion.com/',
    surface: 'web',
    category: 'ai-audio',
    access: 'no-login',
    badges: ['text-to-music', 'no signup', 'instant'],
    bestFor: 'Generating short music clips from text descriptions without any account.',
    qualityNote:
      'Uses a novel approach of generating spectrograms from text prompts. Great for background music, jingles, and experimentation.',
    caveat: 'Clips are short. Quality is experimental compared to dedicated music production.',
  },
  {
    id: 'luvvoice',
    name: 'Luvvoice',
    url: 'https://luvvoice.com/',
    surface: 'web',
    category: 'ai-audio',
    access: 'no-login',
    badges: ['TTS', 'many voices', 'no signup'],
    bestFor:
      'Converting text to natural-sounding speech in multiple languages without registration.',
    qualityNote:
      'Simple and effective TTS with a wide selection of voices and languages. No account needed for basic use.',
    caveat: 'Character limits per conversion on the free tier.',
  },
  {
    id: 'musicfy',
    name: 'Musicfy',
    url: 'https://musicfy.lol/',
    surface: 'web',
    category: 'ai-audio',
    access: 'free-tier',
    badges: ['AI music', 'voice clone', 'text-to-music'],
    bestFor: 'Creating AI-generated music, voice covers, and text-to-music compositions.',
    qualityNote:
      'Offers AI voice conversion, text-to-music, and stem splitting. Fun for creators exploring AI music.',
    caveat: 'Free tier has limited generations. Full features require subscription.',
  },
  {
    id: 'suno',
    name: 'Suno',
    url: 'https://suno.com/',
    surface: 'web',
    category: 'ai-audio',
    access: 'free-tier',
    badges: ['AI music', 'lyrics', 'full songs'],
    bestFor:
      'Generating complete songs with vocals, lyrics, and instrumentation from text prompts.',
    qualityNote:
      'The most impressive free AI music tool. Generates full songs with realistic vocals that sound surprisingly professional.',
    caveat: 'Free tier gives limited daily credits. Commercial use requires paid plan.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // AI WRITING, SUMMARIZATION & TRANSLATION
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'tinywow',
    name: 'TinyWow',
    url: 'https://tinywow.com/',
    surface: 'web',
    category: 'ai-writing',
    access: 'no-login',
    badges: ['multi-tool', 'no signup', 'files deleted'],
    bestFor:
      'A Swiss Army knife of free AI and file tools: writing, PDF, image, video, all in one.',
    qualityNote:
      'Hundreds of free tools including AI writer, summarizer, PDF converter, image editor. Files auto-delete for privacy.',
    caveat: 'Ad-supported. Individual tools may be less polished than specialized alternatives.',
  },
  {
    id: 'toolbaz',
    name: 'ToolBaz',
    url: 'https://toolbaz.com/',
    surface: 'web',
    category: 'ai-writing',
    access: 'no-login',
    badges: ['AI writing', 'no signup', 'multiple tools'],
    bestFor: 'Quick AI text generation, rewriting, and content creation without any registration.',
    qualityNote:
      'Collection of free AI writing tools including text generator, paraphraser, and content detector.',
  },
  {
    id: 'quillbot',
    name: 'QuillBot',
    url: 'https://quillbot.com/',
    surface: 'web',
    category: 'ai-writing',
    access: 'free-tier',
    badges: ['paraphrasing', 'grammar', 'summarizer'],
    bestFor:
      'Paraphrasing, grammar checking, and summarizing text for academic and professional writing.',
    qualityNote:
      'The best free paraphrasing tool. Also includes grammar checker, summarizer, and citation generator.',
    caveat: 'Free tier limits paraphraser to 125 words at a time. Premium unlocks longer text.',
  },
  {
    id: 'deepl-translator',
    name: 'DeepL Translator',
    url: 'https://www.deepl.com/translator',
    surface: 'web',
    category: 'ai-writing',
    access: 'no-login',
    badges: ['translation', 'no signup', 'high quality'],
    bestFor: 'The most natural-sounding machine translation, especially for European languages.',
    qualityNote:
      'Consistently outperforms Google Translate for nuanced text. No account needed for web use. Supports documents too.',
    caveat:
      'Free web version has character limits per translation. Some language pairs better than others.',
  },
  {
    id: 'google-translate',
    name: 'Google Translate',
    url: 'https://translate.google.com/',
    surface: 'web',
    category: 'ai-writing',
    access: 'no-login',
    badges: ['universal', 'no signup', '130+ languages'],
    bestFor: 'Translating between 130+ languages with instant results and no account required.',
    qualityNote:
      'The widest language coverage of any free translator. Includes camera translation, conversation mode, and offline support.',
    caveat: 'Quality varies significantly between language pairs. Nuance can be lost.',
  },
  {
    id: 'languagetool',
    name: 'LanguageTool',
    url: 'https://languagetool.org/',
    surface: 'web',
    category: 'ai-writing',
    access: 'no-login',
    badges: ['grammar', 'multilingual', 'no signup'],
    bestFor: 'Grammar and style checking in 30+ languages without creating an account.',
    qualityNote:
      'Open-source grammar checker that works across languages. Great Grammarly alternative, especially for non-English writing.',
    caveat: 'Free tier has character limits and fewer advanced suggestions than premium.',
  },
  {
    id: 'hemingway-editor',
    name: 'Hemingway Editor',
    url: 'https://hemingwayapp.com/',
    surface: 'web',
    category: 'ai-writing',
    access: 'no-login',
    badges: ['readability', 'no signup', 'simple'],
    bestFor:
      'Making your writing clear and concise by highlighting complex sentences and passive voice.',
    qualityNote:
      'Unique tool that focuses purely on readability. Highlights hard-to-read sentences, adverbs, and passive voice.',
    caveat: 'English only. Does not fix errors — it highlights issues for you to address.',
  },
  {
    id: 'copy-ai',
    name: 'Copy.ai',
    url: 'https://www.copy.ai/',
    surface: 'web',
    category: 'ai-writing',
    access: 'free-tier',
    badges: ['marketing copy', 'templates', 'workflows'],
    bestFor: 'Generating marketing copy, social media posts, and business writing with templates.',
    qualityNote:
      'Excellent for marketing-specific writing. Templates for ads, emails, product descriptions, and social media.',
    caveat: 'Free tier limited to one seat and 2,000 words per month.',
  },
  {
    id: 'rytr',
    name: 'Rytr',
    url: 'https://rytr.me/',
    surface: 'web',
    category: 'ai-writing',
    access: 'free-tier',
    badges: ['AI writer', 'templates', 'affordable'],
    bestFor: 'AI writing assistant with 40+ templates for blogs, emails, ads, and social media.',
    qualityNote:
      'Good for structured content creation with tone and use-case templates. Outputs are decent starting points.',
    caveat: 'Free tier limited to 10,000 characters per month.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // AI PDF & DOCUMENT TOOLS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'chatpdf',
    name: 'ChatPDF',
    url: 'https://www.chatpdf.com/',
    surface: 'web',
    category: 'ai-pdf',
    access: 'no-login',
    badges: ['chat with PDF', 'no signup', 'instant'],
    bestFor: 'Uploading a PDF and asking questions about its content instantly.',
    qualityNote:
      'Upload any PDF and chat with it. Excellent for quickly understanding research papers, contracts, and long documents.',
    caveat: 'Free tier limits pages per PDF and questions per day.',
  },
  {
    id: 'smallpdf-ai',
    name: 'Smallpdf AI',
    url: 'https://smallpdf.com/ai-pdf-summarizer',
    surface: 'web',
    category: 'ai-pdf',
    access: 'free-tier',
    badges: ['PDF summary', 'Q&A', 'trusted'],
    bestFor: 'Quickly summarizing and extracting key information from PDF documents.',
    qualityNote:
      'Part of the trusted Smallpdf suite. AI summarization is accurate and highlights the most important sections.',
    caveat: 'Free tier has daily processing limits. Full suite requires subscription.',
  },
  {
    id: 'ilovepdf',
    name: 'ILovePDF',
    url: 'https://www.ilovepdf.com/',
    surface: 'web',
    category: 'ai-pdf',
    access: 'no-login',
    badges: ['PDF tools', 'no signup', 'comprehensive'],
    bestFor: 'Every PDF operation imaginable: merge, split, compress, convert, sign, and edit.',
    qualityNote:
      'The most comprehensive free PDF toolkit on the web. Handles conversions, compression, and editing without an account.',
    caveat: 'Free tier has daily task limits. Batch processing requires premium.',
  },
  {
    id: 'pdf24',
    name: 'PDF24 Tools',
    url: 'https://tools.pdf24.org/',
    surface: 'web',
    category: 'ai-pdf',
    access: 'no-login',
    badges: ['PDF tools', 'no signup', 'German quality'],
    bestFor: 'Reliable PDF creation, editing, and conversion tools with no account required.',
    qualityNote:
      'Completely free, no file limits, and genuinely no-login. One of the most generous free PDF toolkits available.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // AI SEARCH & RESEARCH
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'perplexity-search',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/',
    surface: 'web',
    category: 'ai-search',
    access: 'free-tier',
    badges: ['cited search', 'research', 'real-time'],
    bestFor: 'AI-powered research with inline citations so you can verify every claim.',
    qualityNote:
      'The most trustworthy AI search tool because it shows its sources. Excellent for research, fact-checking, and learning.',
    caveat: 'Pro Search limited on free tier. Basic search is unlimited.',
  },
  {
    id: 'consensus',
    name: 'Consensus',
    url: 'https://consensus.app/',
    surface: 'web',
    category: 'ai-search',
    access: 'free-tier',
    badges: ['academic', 'evidence-based', 'papers'],
    bestFor: 'Finding scientific consensus and evidence-based answers from peer-reviewed research.',
    qualityNote:
      'Searches across 200M+ academic papers and synthesizes findings. Essential for evidence-based decision making.',
    caveat:
      'Free tier limits searches per month. Best for scientific/medical/social science questions.',
  },
  {
    id: 'elicit',
    name: 'Elicit',
    url: 'https://elicit.com/',
    surface: 'web',
    category: 'ai-search',
    access: 'free-tier',
    badges: ['research assistant', 'papers', 'extraction'],
    bestFor:
      'Automating literature review by finding, summarizing, and extracting data from papers.',
    qualityNote:
      'Built specifically for researchers. Extracts structured data from papers and helps synthesize findings across studies.',
    caveat: 'Free tier has usage limits. Most powerful for academic/scientific research.',
  },
  {
    id: 'semantic-scholar',
    name: 'Semantic Scholar',
    url: 'https://www.semanticscholar.org/',
    surface: 'web',
    category: 'ai-search',
    access: 'no-login',
    badges: ['academic', 'AI-powered', 'free'],
    bestFor:
      'Finding and understanding academic papers with AI-generated summaries and citation graphs.',
    qualityNote:
      'By Allen AI. Covers 200M+ papers with AI-generated TLDRs, citation context, and influence scores. Completely free.',
  },
  {
    id: 'connected-papers',
    name: 'Connected Papers',
    url: 'https://www.connectedpapers.com/',
    surface: 'web',
    category: 'ai-search',
    access: 'free-tier',
    badges: ['paper exploration', 'visual graph', 'discovery'],
    bestFor: 'Visually exploring related papers and discovering research you would have missed.',
    qualityNote:
      'Creates beautiful visual graphs of paper relationships. Invaluable for literature reviews and finding seminal works.',
    caveat: 'Free tier limits graphs per month. Requires starting from a known paper.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // AI MATH, SCIENCE & EDUCATION
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'wolfram-alpha',
    name: 'Wolfram Alpha',
    url: 'https://www.wolframalpha.com/',
    surface: 'web',
    category: 'ai-math',
    access: 'no-login',
    badges: ['computational', 'math', 'science'],
    bestFor: 'Answering math, science, engineering, and data questions with computed results.',
    qualityNote:
      'The computational knowledge engine. Solves equations, plots functions, converts units, and answers factual queries with precision.',
    caveat: 'Step-by-step solutions require Pro. Free tier shows answers but not always the work.',
  },
  {
    id: 'desmos',
    name: 'Desmos',
    url: 'https://www.desmos.com/',
    surface: 'web',
    category: 'ai-math',
    access: 'no-login',
    badges: ['graphing', 'no signup', 'interactive'],
    bestFor:
      'Interactive graphing calculator for visualizing functions, data, and geometric constructions.',
    qualityNote:
      'The best free graphing calculator on the web. Used by millions of students and teachers. Beautifully designed.',
  },
  {
    id: 'geogebra',
    name: 'GeoGebra',
    url: 'https://www.geogebra.org/',
    surface: 'web',
    category: 'ai-math',
    access: 'no-login',
    badges: ['math tools', 'geometry', 'free'],
    bestFor:
      'Interactive geometry, algebra, calculus, and statistics tools for learning and teaching.',
    qualityNote:
      'Comprehensive free math software used worldwide in education. Includes graphing, geometry, 3D, spreadsheets, and CAS.',
  },
  {
    id: 'khan-academy',
    name: 'Khan Academy',
    url: 'https://www.khanacademy.org/',
    surface: 'web',
    category: 'ai-math',
    access: 'free-tier',
    badges: ['education', 'courses', 'AI tutor'],
    bestFor: 'Free world-class education in math, science, computing, and more with AI tutoring.',
    qualityNote:
      'Completely free education platform with Khanmigo AI tutor. Covers K-12 through college-level courses with practice exercises.',
    caveat: 'Khanmigo AI tutor features may have limited availability on free tier.',
  },
  {
    id: 'symbolab',
    name: 'Symbolab',
    url: 'https://www.symbolab.com/',
    surface: 'web',
    category: 'ai-math',
    access: 'free-tier',
    badges: ['math solver', 'step-by-step', 'algebra'],
    bestFor: 'Step-by-step solutions for algebra, calculus, trigonometry, and other math problems.',
    qualityNote:
      'Shows detailed solution steps, not just answers. Covers a wide range of math topics from basic to advanced.',
    caveat: 'Free tier limits step-by-step solutions per day. Full access requires subscription.',
  },
  {
    id: 'mathway',
    name: 'Mathway',
    url: 'https://www.mathway.com/',
    surface: 'web',
    category: 'ai-math',
    access: 'free-tier',
    badges: ['math solver', 'camera input', 'instant'],
    bestFor: 'Instant math problem solving with camera input — point your phone and get answers.',
    qualityNote:
      'Solves problems across basic math, algebra, calculus, statistics, and more. Camera input makes it great for homework.',
    caveat: 'Free tier shows answers only. Step-by-step solutions require premium.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // AI PRESENTATIONS & SLIDES
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'gamma',
    name: 'Gamma',
    url: 'https://gamma.app/',
    surface: 'web',
    category: 'ai-presentation',
    access: 'free-tier',
    badges: ['AI slides', 'beautiful', 'fast'],
    bestFor:
      'Creating beautiful presentations, documents, and websites from a text prompt in minutes.',
    qualityNote:
      'The best AI presentation tool. Generates polished, professional slides from a simple description. Results look genuinely good.',
    caveat: 'Free tier includes Gamma branding. Export to PowerPoint requires credits.',
  },
  {
    id: 'beautiful-ai',
    name: 'Beautiful.ai',
    url: 'https://www.beautiful.ai/',
    surface: 'web',
    category: 'ai-presentation',
    access: 'free-tier',
    badges: ['smart slides', 'design rules', 'professional'],
    bestFor:
      'Presentations that automatically follow design rules so they always look professional.',
    qualityNote:
      'Smart templates that adapt as you add content. The AI enforces good design principles automatically.',
    caveat: 'Free tier is limited. Most useful features require Pro subscription.',
  },
  {
    id: 'slidesai',
    name: 'SlidesAI',
    url: 'https://www.slidesai.io/',
    surface: 'web',
    category: 'ai-presentation',
    access: 'free-tier',
    badges: ['Google Slides', 'text-to-slides', 'addon'],
    bestFor: 'Turning text and notes into Google Slides presentations automatically.',
    qualityNote:
      'Works as a Google Slides add-on. Paste your text and it generates a complete slide deck with layouts and images.',
    caveat: 'Free tier limited to 3 presentations per month.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // DESIGN & MEDIA (existing)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'pollinations',
    name: 'Pollinations.ai',
    url: 'https://pollinations.ai/',
    surface: 'web',
    category: 'design-media',
    access: 'public-api',
    badges: ['image', 'text', 'open API'],
    bestFor: 'Fast images, quick text endpoints, prototypes, and visual prompts.',
    qualityNote:
      'A rare tool that is both web-friendly and API-friendly, with open access patterns developers can wire up fast.',
  },
  {
    id: 'excalidraw',
    name: 'Excalidraw',
    url: 'https://excalidraw.com/',
    surface: 'web',
    category: 'design-media',
    access: 'open-source',
    badges: ['diagramming', 'no signup', 'OSS'],
    bestFor:
      'Explaining ideas, system diagrams, UI sketches, and plans without a design subscription.',
    qualityNote: 'Mature, beloved, open-source diagramming that works immediately in a browser.',
  },
  {
    id: 'photopea',
    name: 'Photopea',
    url: 'https://www.photopea.com/',
    surface: 'web',
    category: 'design-media',
    access: 'no-login',
    badges: ['PSD', 'image editor', 'browser'],
    bestFor: 'Photoshop-like editing on machines where you cannot install anything.',
    qualityNote:
      'One of the strongest free browser image editors, especially for PSD and practical design work.',
  },
  {
    id: 'penpot',
    name: 'Penpot',
    url: 'https://penpot.app/',
    surface: 'web',
    category: 'design-media',
    access: 'open-source',
    badges: ['Figma alternative', 'OSS', 'teams'],
    bestFor: 'UI design and collaboration when Figma is too expensive or too locked down.',
    qualityNote: 'Serious open-source product design tool with hosted and self-hosted paths.',
    caveat: 'Hosted collaboration needs an account; self-hosting needs technical comfort.',
  },
  {
    id: 'diagrams-net',
    name: 'diagrams.net',
    url: 'https://app.diagrams.net/',
    surface: 'web',
    category: 'design-media',
    access: 'no-login',
    badges: ['diagrams', 'offline-capable', 'no signup'],
    bestFor: 'Architecture diagrams, flowcharts, network maps, and documentation visuals.',
    qualityNote:
      'A boring, dependable classic. It saves locally and does not force an account for core work.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CODING & DEVELOPER TOOLS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'stackblitz',
    name: 'StackBlitz',
    url: 'https://stackblitz.com/',
    surface: 'web',
    category: 'coding-devtools',
    access: 'free-tier',
    badges: ['web IDE', 'Node in browser', 'frontend'],
    bestFor: 'Instant web app prototypes and debugging snippets without local setup.',
    qualityNote:
      'Fast browser development environment that removes install friction for learners and broke machines.',
  },
  {
    id: 'codesandbox',
    name: 'CodeSandbox',
    url: 'https://codesandbox.io/',
    surface: 'web',
    category: 'coding-devtools',
    access: 'free-tier',
    badges: ['web IDE', 'frontend', 'sharing'],
    bestFor: 'Shareable frontend experiments, reproductions, and learning projects.',
    qualityNote:
      'Still one of the easiest ways to make code visible and shareable from any browser.',
  },
  {
    id: 'bolt-new',
    name: 'Bolt.new',
    url: 'https://bolt.new/',
    surface: 'web',
    category: 'coding-devtools',
    access: 'free-tier',
    badges: ['full-stack', 'AI-powered', 'instant deploy'],
    bestFor:
      'Building and deploying full-stack web apps entirely in the browser with AI assistance.',
    qualityNote:
      'By StackBlitz. Describe what you want in natural language and it generates, runs, and deploys a full-stack app. Revolutionary for prototyping.',
    caveat: 'Free tier has limited AI tokens per day. Complex apps may need manual refinement.',
  },
  {
    id: 'v0-dev',
    name: 'v0 by Vercel',
    url: 'https://v0.dev/',
    surface: 'web',
    category: 'coding-devtools',
    access: 'free-tier',
    badges: ['UI generation', 'React', 'Tailwind'],
    bestFor:
      'Generating production-ready React/Next.js UI components from text descriptions or images.',
    qualityNote:
      'The best AI tool for generating React components with Tailwind CSS. Outputs clean, copy-pasteable code that actually works.',
    caveat: 'Free tier has generation limits. Outputs are React/Next.js focused.',
  },
  {
    id: 'replit',
    name: 'Replit',
    url: 'https://replit.com/',
    surface: 'web',
    category: 'coding-devtools',
    access: 'free-tier',
    badges: ['browser IDE', 'AI agent', 'deploy'],
    bestFor: 'Coding, running, and deploying apps from any browser with AI assistance built in.',
    qualityNote:
      'Full development environment in the browser. AI agent can build apps from descriptions. Great for learning and prototyping.',
    caveat: 'Free tier has resource limits. Always-on deployments require paid plan.',
  },
  {
    id: 'continue-dev',
    name: 'Continue.dev',
    url: 'https://continue.dev/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['IDE extension', 'open-source', 'local AI'],
    bestFor:
      'Adding AI code assistance to VS Code or JetBrains with any model, including local ones.',
    qualityNote:
      'The leading open-source AI coding assistant. Works with Ollama, OpenAI, Anthropic, or any provider. Full data control.',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    url: 'https://ollama.com/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['local AI', 'private', 'many models'],
    bestFor: 'Running AI models locally on your own machine for complete privacy and zero cost.',
    qualityNote:
      'The easiest way to run Llama, Mistral, CodeLlama, and dozens of open models locally. One command to get started.',
    caveat: 'Requires decent hardware (8GB+ RAM). Large models need GPU for reasonable speed.',
  },
  {
    id: 'aider',
    name: 'Aider',
    url: 'https://aider.chat/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['AI coding agent', 'terminal', 'Git-aware'],
    bestFor:
      'AI pair programming in the terminal that directly edits your codebase and commits changes.',
    qualityNote:
      'The most capable open-source AI coding agent. Works with any model, understands your repo structure, and makes real edits.',
    caveat:
      'Requires an API key for cloud models, or use with Ollama for fully free local inference.',
  },
  {
    id: 'cody-sourcegraph',
    name: 'Cody by Sourcegraph',
    url: 'https://sourcegraph.com/cody',
    surface: 'web',
    category: 'coding-devtools',
    access: 'free-tier',
    badges: ['AI code assistant', 'codebase-aware', 'IDE'],
    bestFor: 'AI code assistant that understands your entire codebase, not just the current file.',
    qualityNote:
      'Free tier includes generous autocomplete and chat. Codebase-aware context means better answers than generic AI.',
    caveat: 'Free tier has monthly usage limits on chat and commands.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // BACKEND & INFRASTRUCTURE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    url: 'https://pages.github.com/',
    surface: 'web',
    category: 'backend-infra',
    access: 'free-tier',
    badges: ['static hosting', 'custom domain', 'git'],
    bestFor: 'Publishing static sites, docs, portfolios, and small tools for free.',
    qualityNote: 'The simplest no-server path for shipping something public from a repository.',
  },
  {
    id: 'cloudflare-pages',
    name: 'Cloudflare Pages',
    url: 'https://pages.cloudflare.com/',
    surface: 'web',
    category: 'backend-infra',
    access: 'free-tier',
    badges: ['static hosting', 'edge', 'generous'],
    bestFor: 'Free static hosting with preview deploys and a strong global edge.',
    qualityNote:
      'Generous free tier and production-grade delivery for small teams and solo builders.',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    url: 'https://supabase.com/',
    surface: 'web',
    category: 'backend-infra',
    access: 'free-tier',
    badges: ['Postgres', 'auth', 'storage'],
    bestFor: 'A real backend for prototypes: database, auth, storage, edge functions.',
    qualityNote:
      'The quickest credible open-source Firebase alternative for developers on a zero-dollar start.',
    caveat: 'Hosted free tier has quotas and usually requires an account.',
  },
  {
    id: 'neon',
    name: 'Neon',
    url: 'https://neon.tech/',
    surface: 'web',
    category: 'backend-infra',
    access: 'free-tier',
    badges: ['Postgres', 'serverless', 'branching'],
    bestFor: 'Free Postgres for prototypes, demos, learning SQL, and small apps.',
    qualityNote:
      'A practical free database path with developer-friendly branching and modern Postgres ergonomics.',
  },
  {
    id: 'railway',
    name: 'Railway',
    url: 'https://railway.com/',
    surface: 'web',
    category: 'backend-infra',
    access: 'free-tier',
    badges: ['deploy', 'containers', 'apps'],
    bestFor: 'Deploying small services when static hosting is not enough.',
    qualityNote: 'Good developer experience for turning a repo into a live service quickly.',
    caveat: 'Free/credit policies change often; verify before depending on it.',
  },
  {
    id: 'render',
    name: 'Render',
    url: 'https://render.com/',
    surface: 'web',
    category: 'backend-infra',
    access: 'free-tier',
    badges: ['deploy', 'static', 'services'],
    bestFor: 'Static sites, small web services, and simple deploys without DevOps overhead.',
    qualityNote: 'Clear deploy UX and a known path for beginners moving beyond localhost.',
    caveat: 'Free services can sleep and limits can change.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // AUTOMATION & OPS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'n8n',
    name: 'n8n',
    url: 'https://n8n.io/',
    surface: 'web',
    category: 'automation-ops',
    access: 'self-host',
    badges: ['automation', 'self-host', 'Zapier alternative'],
    bestFor: 'Automating boring workflows without paying per task.',
    qualityNote:
      'Powerful workflow automation with a self-hostable path that can replace a lot of paid glue.',
    caveat: 'Hosted cloud is paid/freemium; the zero-cost path is self-hosting.',
  },
  {
    id: 'uptime-kuma',
    name: 'Uptime Kuma',
    url: 'https://github.com/louislam/uptime-kuma',
    surface: 'web',
    category: 'automation-ops',
    access: 'self-host',
    badges: ['monitoring', 'self-host', 'OSS'],
    bestFor: 'Monitoring websites, APIs, cron jobs, and personal infrastructure.',
    qualityNote:
      'One of the best free self-hosted uptime monitors: polished, practical, and widely used.',
  },
  {
    id: 'kuma-status',
    name: 'OpenStatus',
    url: 'https://www.openstatus.dev/',
    surface: 'web',
    category: 'automation-ops',
    access: 'open-source',
    badges: ['status pages', 'monitoring', 'OSS'],
    bestFor: 'Open-source monitoring/status pages without jumping straight to paid SaaS.',
    qualityNote:
      'A credible open-source alternative in a category that often becomes expensive fast.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECURITY & PRIVACY
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'vaultwarden',
    name: 'Vaultwarden',
    url: 'https://github.com/dani-garcia/vaultwarden',
    surface: 'web',
    category: 'security-privacy',
    access: 'self-host',
    badges: ['passwords', 'self-host', 'OSS'],
    bestFor:
      'Running a lightweight Bitwarden-compatible password manager for a family or small group.',
    qualityNote:
      'A proven, resource-light way to get excellent password management without a subscription.',
    caveat: 'Self-hosting password infrastructure requires backups and careful security hygiene.',
  },
  {
    id: 'bitwarden-free',
    name: 'Bitwarden Free',
    url: 'https://bitwarden.com/',
    surface: 'web',
    category: 'security-privacy',
    access: 'free-tier',
    badges: ['passwords', 'apps', 'OSS core'],
    bestFor: 'A no-cost password manager that normal people can actually use.',
    qualityNote: 'The free tier covers the essential password-manager job well, across devices.',
  },
  {
    id: 'proton-drive-free',
    name: 'Proton Drive Free',
    url: 'https://proton.me/drive',
    surface: 'web',
    category: 'security-privacy',
    access: 'free-tier',
    badges: ['encrypted storage', 'privacy', 'files'],
    bestFor:
      'Private file storage for documents that should not sit unprotected on a shared machine.',
    qualityNote: 'A useful privacy-first free tier from a serious provider.',
    caveat: 'Storage is limited on free plans.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PRODUCTIVITY
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'joplin-cloudless',
    name: 'Joplin',
    url: 'https://joplinapp.org/',
    surface: 'web',
    category: 'productivity',
    access: 'open-source',
    badges: ['notes', 'offline', 'OSS'],
    bestFor: 'Owning notes, research, plans, and personal knowledge without Notion lock-in.',
    qualityNote:
      'Excellent open-source notes app with local-first control and multiple sync options.',
  },
  {
    id: 'cryptpad',
    name: 'CryptPad',
    url: 'https://cryptpad.fr/',
    surface: 'web',
    category: 'productivity',
    access: 'free-tier',
    badges: ['encrypted docs', 'collaboration', 'no Google'],
    bestFor: 'Private collaborative docs, sheets, forms, and whiteboards.',
    qualityNote:
      'End-to-end encrypted collaboration is rare in free web tools; CryptPad is a serious option.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // LEARNING & CAREER
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'libretranslate',
    name: 'LibreTranslate',
    url: 'https://libretranslate.com/',
    surface: 'web',
    category: 'learning-career',
    access: 'open-source',
    badges: ['translation', 'API', 'self-host'],
    bestFor: 'Translation without depending entirely on closed commercial APIs.',
    qualityNote: 'Open-source translation with public instances and a self-host path.',
    caveat: 'Public instances vary in quality and rate limits.',
  },
  {
    id: 'freecodecamp',
    name: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/',
    surface: 'web',
    category: 'learning-career',
    access: 'free-tier',
    badges: ['curriculum', 'certificates', 'coding'],
    bestFor: 'Structured coding learning when paid bootcamps are not an option.',
    qualityNote:
      'Massive, proven free curriculum with real practice instead of passive videos only.',
  },
  {
    id: 'roadmap-sh',
    name: 'roadmap.sh',
    url: 'https://roadmap.sh/',
    surface: 'web',
    category: 'learning-career',
    access: 'free-tier',
    badges: ['roadmaps', 'developer career', 'guides'],
    bestFor: 'Knowing what to learn next without buying a course.',
    qualityNote: 'High-signal developer roadmaps that cut through tutorial noise.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PUBLIC DATA APIs
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'open-meteo',
    name: 'Open-Meteo',
    url: 'https://open-meteo.com/',
    surface: 'api',
    category: 'public-data',
    access: 'public-api',
    badges: ['weather', 'no key', 'JSON'],
    bestFor: 'Weather, climate, historical data, air quality, geocoding, and forecast prototypes.',
    qualityNote:
      'No API key, clear docs, strong model coverage, and a self-hostable open-source server.',
    caveat: 'Free non-commercial usage has limits and requires attribution.',
  },
  {
    id: 'nws-api',
    name: 'National Weather Service API',
    url: 'https://www.weather.gov/documentation/services-web-api',
    surface: 'api',
    category: 'public-data',
    access: 'public-api',
    badges: ['US weather', 'no key', 'government'],
    bestFor: 'US weather alerts, forecasts, stations, zones, and public safety apps.',
    qualityNote:
      'Official US weather data is the right source for serious alerting and civic tools.',
    caveat: 'US-focused; follow usage policies and identify your app in requests.',
  },
  {
    id: 'data-gov',
    name: 'Data.gov APIs',
    url: 'https://data.gov/developers/apis',
    surface: 'api',
    category: 'public-data',
    access: 'public-api',
    badges: ['US open data', 'government', 'datasets'],
    bestFor:
      'Finding US federal datasets across health, labor, climate, finance, and public services.',
    qualityNote: 'The index for public-good data that can power serious civic and survival tools.',
  },
  {
    id: 'rest-countries',
    name: 'REST Countries',
    url: 'https://restcountries.com/',
    surface: 'api',
    category: 'public-data',
    access: 'public-api',
    badges: ['countries', 'no key', 'JSON'],
    bestFor: 'Country metadata, flags, currencies, calling codes, and region filters.',
    qualityNote:
      'A reliable starter API for real apps and teaching because the domain is useful and understandable.',
  },
  {
    id: 'frankfurter',
    name: 'Frankfurter',
    url: 'https://www.frankfurter.app/',
    surface: 'api',
    category: 'public-data',
    access: 'public-api',
    badges: ['exchange rates', 'no key', 'ECB'],
    bestFor: 'Currency conversion prototypes without signing up for a finance API.',
    qualityNote: 'Simple exchange-rate API using European Central Bank reference data.',
    caveat: 'Not for trading or real-time financial decisions.',
  },
  {
    id: 'openfoodfacts-api',
    name: 'Open Food Facts API',
    url: 'https://world.openfoodfacts.org/data',
    surface: 'api',
    category: 'public-data',
    access: 'public-api',
    badges: ['food', 'barcodes', 'open data'],
    bestFor: 'Nutrition apps, barcode lookup, grocery tools, and public health prototypes.',
    qualityNote:
      'Community-maintained open food database with real-world utility for low-budget apps.',
  },
  {
    id: 'overpass-api',
    name: 'Overpass API',
    url: 'https://wiki.openstreetmap.org/wiki/Overpass_API',
    surface: 'api',
    category: 'public-data',
    access: 'public-api',
    badges: ['OpenStreetMap', 'geodata', 'queries'],
    bestFor: 'Finding public map features: clinics, shelters, libraries, transit, water, shops.',
    qualityNote:
      'OpenStreetMap queries can power practical local-help tools without proprietary maps.',
    caveat: 'Public instances are shared resources. Cache results and be polite.',
  },
  {
    id: 'nominatim',
    name: 'Nominatim',
    url: 'https://nominatim.org/release-docs/latest/api/Overview/',
    surface: 'api',
    category: 'public-data',
    access: 'public-api',
    badges: ['geocoding', 'OSM', 'no key'],
    bestFor: 'Address search and reverse geocoding for low-volume civic tools.',
    qualityNote: 'The standard open geocoding path for OSM-backed projects.',
    caveat: 'Strict public usage policy; self-host or use a provider for production/high volume.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // DOCS & KNOWLEDGE APIs
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'wikimedia-api',
    name: 'Wikimedia APIs',
    url: 'https://api.wikimedia.org/wiki/Main_Page',
    surface: 'api',
    category: 'docs-knowledge',
    access: 'public-api',
    badges: ['Wikipedia', 'Commons', 'free knowledge'],
    bestFor: 'Search, summaries, media, page metadata, and free knowledge integrations.',
    qualityNote:
      'Direct access to one of the most valuable public knowledge infrastructures on earth.',
  },
  {
    id: 'open-library-api',
    name: 'Open Library API',
    url: 'https://openlibrary.org/developers/api',
    surface: 'api',
    category: 'docs-knowledge',
    access: 'public-api',
    badges: ['books', 'metadata', 'public'],
    bestFor: 'Book search, ISBN lookup, author data, covers, and library-centered projects.',
    qualityNote: 'Free public APIs and data dumps for mission-aligned book and education tools.',
    caveat: 'Not intended as a high-volume third-party backend.',
  },
  {
    id: 'crossref-api',
    name: 'Crossref REST API',
    url: 'https://www.crossref.org/documentation/retrieve-metadata/rest-api/',
    surface: 'api',
    category: 'docs-knowledge',
    access: 'public-api',
    badges: ['DOI', 'research', 'metadata'],
    bestFor: 'Academic metadata, DOI lookup, citations, and literature discovery.',
    qualityNote: 'Essential free infrastructure for research tools and citation workflows.',
  },
  {
    id: 'hacker-news-api',
    name: 'Hacker News Firebase API',
    url: 'https://github.com/HackerNews/API',
    surface: 'api',
    category: 'docs-knowledge',
    access: 'public-api',
    badges: ['news', 'no key', 'Firebase'],
    bestFor: 'Developer-news readers, trend trackers, search experiments, and teaching APIs.',
    qualityNote: 'Simple, free, no-auth API with live-ish HN data and stable examples.',
  },
  {
    id: 'openalex',
    name: 'OpenAlex',
    url: 'https://docs.openalex.org/',
    surface: 'api',
    category: 'docs-knowledge',
    access: 'public-api',
    badges: ['scholarly graph', 'research', 'open'],
    bestFor: 'Research discovery, author/institution graphs, citations, and open bibliometrics.',
    qualityNote: 'A serious open scholarly index with generous public access and clear docs.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CODING & DEVTOOLS APIs
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'github-api',
    name: 'GitHub REST API',
    url: 'https://docs.github.com/en/rest',
    surface: 'api',
    category: 'coding-devtools',
    access: 'public-api',
    badges: ['repos', 'issues', 'actions'],
    bestFor: 'Repo search, issues, pull requests, releases, automation, and portfolio tooling.',
    qualityNote: 'The default API for building developer tools around the open-source ecosystem.',
    caveat: 'Unauthenticated rate limits are low; tokens improve limits but must be protected.',
  },
  {
    id: 'gitlab-api',
    name: 'GitLab REST API',
    url: 'https://docs.gitlab.com/api/',
    surface: 'api',
    category: 'coding-devtools',
    access: 'public-api',
    badges: ['repos', 'CI', 'DevOps'],
    bestFor:
      'Open DevOps automation around GitLab projects, pipelines, issues, and merge requests.',
    qualityNote:
      'Broad API surface that can power serious internal tools even on free/self-hosted GitLab.',
  },
  {
    id: 'jsonplaceholder',
    name: 'JSONPlaceholder',
    url: 'https://jsonplaceholder.typicode.com/',
    surface: 'api',
    category: 'coding-devtools',
    access: 'public-api',
    badges: ['fake REST', 'no key', 'teaching'],
    bestFor: 'Learning fetch, CRUD UI, demos, tests, and frontend exercises.',
    qualityNote: 'The quickest fake REST API that still teaches real client patterns.',
  },
  {
    id: 'dummyjson',
    name: 'DummyJSON',
    url: 'https://dummyjson.com/',
    surface: 'api',
    category: 'coding-devtools',
    access: 'public-api',
    badges: ['fake store', 'auth demos', 'JSON'],
    bestFor: 'E-commerce demos, auth mockups, carts, products, and realistic frontend practice.',
    qualityNote:
      'More practical fake data than toy examples, with endpoints that resemble real app work.',
  },
  {
    id: 'httpbin',
    name: 'httpbin',
    url: 'https://httpbin.org/',
    surface: 'api',
    category: 'coding-devtools',
    access: 'public-api',
    badges: ['HTTP testing', 'no key', 'debugging'],
    bestFor: 'Testing clients, headers, auth, redirects, cookies, and webhooks.',
    qualityNote: 'The classic HTTP inspection endpoint every developer eventually needs.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // DESIGN-MEDIA APIs
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'pollinations-api',
    name: 'Pollinations API',
    url: 'https://pollinations.ai/',
    surface: 'api',
    category: 'design-media',
    access: 'public-api',
    badges: ['image API', 'text API', 'no key'],
    bestFor: 'Adding generated images or text to tiny apps without a paid model key.',
    qualityNote:
      'Useful because the API is simple enough for beginners and open enough for rapid prototypes.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // LEARNING & CAREER APIs
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'libretranslate-api',
    name: 'LibreTranslate API',
    url: 'https://libretranslate.com/docs/',
    surface: 'api',
    category: 'learning-career',
    access: 'open-source',
    badges: ['translation', 'self-host', 'REST'],
    bestFor: 'Translation features where self-hosting is preferable to closed paid APIs.',
    qualityNote:
      'The self-host path matters: translation can be a privacy-sensitive survival tool.',
    caveat: 'Public endpoints may require keys or have rate limits; self-host for reliability.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CLI — CODING & DEVTOOLS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'ripgrep',
    name: 'ripgrep',
    url: 'https://github.com/BurntSushi/ripgrep',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['search', 'fast', 'Rust'],
    bestFor: 'Finding text in large codebases instantly.',
    qualityNote: 'The first CLI upgrade many developers should install. It saves hours.',
  },
  {
    id: 'fd',
    name: 'fd',
    url: 'https://github.com/sharkdp/fd',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['file search', 'fast', 'ergonomic'],
    bestFor: 'Finding files without memorizing hostile find syntax.',
    qualityNote: 'Fast, readable, and pairs perfectly with fzf and editors.',
  },
  {
    id: 'jq',
    name: 'jq',
    url: 'https://jqlang.github.io/jq/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['JSON', 'scripts', 'API'],
    bestFor: 'Reading, filtering, transforming, and debugging JSON API responses.',
    qualityNote: 'Essential for anyone working with APIs on a low-resource machine.',
  },
  {
    id: 'yq',
    name: 'yq',
    url: 'https://github.com/mikefarah/yq',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['YAML', 'JSON', 'configs'],
    bestFor: 'Editing YAML/JSON/TOML/XML configs in scripts.',
    qualityNote:
      'Practical infrastructure glue for Docker, Kubernetes, CI, and config-heavy repos.',
  },
  {
    id: 'httpie',
    name: 'HTTPie CLI',
    url: 'https://httpie.io/cli',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['HTTP', 'API testing', 'readable'],
    bestFor: 'Testing APIs with friendlier syntax than raw curl.',
    qualityNote: 'A real productivity win for beginners and pros debugging REST APIs.',
  },
  {
    id: 'curl',
    name: 'curl',
    url: 'https://curl.se/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['HTTP', 'portable', 'universal'],
    bestFor: 'Downloading, probing, and scripting almost any network request.',
    qualityNote:
      'The universal network tool. It is everywhere, documented everywhere, and still unbeatable.',
  },
  {
    id: 'git',
    name: 'Git',
    url: 'https://git-scm.com/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['version control', 'universal', 'OSS'],
    bestFor: 'Owning your work history and collaborating without paid tooling.',
    qualityNote: 'The core skill/tool for escaping fragile copy-paste development.',
  },
  {
    id: 'gh-cli',
    name: 'GitHub CLI',
    url: 'https://cli.github.com/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['GitHub', 'PRs', 'issues'],
    bestFor: 'Managing repos, pull requests, issues, releases, and Actions from the terminal.',
    qualityNote: 'Turns GitHub into scriptable infrastructure for solo developers and maintainers.',
  },
  {
    id: 'uv',
    name: 'uv',
    url: 'https://github.com/astral-sh/uv',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['Python', 'packages', 'fast'],
    bestFor: 'Installing Python packages, managing projects, and replacing slow Python tooling.',
    qualityNote: 'Fast enough to make Python project setup feel modern on modest hardware.',
  },
  {
    id: 'pnpm',
    name: 'pnpm',
    url: 'https://pnpm.io/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['Node', 'packages', 'disk efficient'],
    bestFor: 'Node package installs that are faster and use less disk space.',
    qualityNote: 'Great for old laptops where node_modules waste hurts.',
  },
  {
    id: 'mise',
    name: 'mise',
    url: 'https://mise.jdx.dev/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['runtime versions', 'tasks', 'dev env'],
    bestFor: 'Managing Node, Python, Go, Ruby, Java, and project tasks consistently.',
    qualityNote: 'A practical modern replacement for a pile of language-specific version managers.',
  },
  {
    id: 'lazygit',
    name: 'lazygit',
    url: 'https://github.com/jesseduffield/lazygit',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['Git TUI', 'terminal', 'fast'],
    bestFor: 'Understanding and managing Git changes visually from the terminal.',
    qualityNote:
      'Excellent for people who know Git concepts but need a clearer interface under pressure.',
  },
  {
    id: 'hyperfine',
    name: 'hyperfine',
    url: 'https://github.com/sharkdp/hyperfine',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['benchmark', 'scripts', 'performance'],
    bestFor: 'Measuring command performance honestly instead of guessing.',
    qualityNote: 'Makes performance conversations concrete with repeatable benchmarks.',
  },
  {
    id: 'tokei',
    name: 'tokei',
    url: 'https://github.com/XAMPPRocky/tokei',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['code stats', 'fast', 'multi-language'],
    bestFor: 'Counting code by language quickly for audits and repo understanding.',
    qualityNote: 'Fast codebase visibility without SaaS analytics.',
  },
  {
    id: 'ruff',
    name: 'Ruff',
    url: 'https://docs.astral.sh/ruff/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['Python', 'lint', 'format'],
    bestFor: 'Python linting and formatting that is fast enough to run constantly.',
    qualityNote: 'A major free upgrade for Python code quality and feedback loops.',
  },
  {
    id: 'biome',
    name: 'Biome',
    url: 'https://biomejs.dev/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['JS/TS', 'lint', 'format'],
    bestFor: 'Fast formatting and linting for JavaScript/TypeScript projects.',
    qualityNote: 'A serious all-in-one tool that can simplify frontend project maintenance.',
  },
  {
    id: 'playwright',
    name: 'Playwright',
    url: 'https://playwright.dev/',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['testing', 'browser automation', 'E2E'],
    bestFor: 'End-to-end tests, screenshots, browser automation, and visual checks.',
    qualityNote:
      'Production-grade browser automation for free, with great docs and cross-browser support.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CLI — AUTOMATION & OPS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'just',
    name: 'just',
    url: 'https://github.com/casey/just',
    surface: 'cli',
    category: 'automation-ops',
    access: 'open-source',
    badges: ['task runner', 'recipes', 'simple'],
    bestFor: 'Giving a project clear commands: test, build, deploy, format, reset.',
    qualityNote:
      'Small, readable automation that helps contributors succeed without tribal knowledge.',
  },
  {
    id: 'direnv',
    name: 'direnv',
    url: 'https://direnv.net/',
    surface: 'cli',
    category: 'automation-ops',
    access: 'open-source',
    badges: ['env vars', 'shell', 'security'],
    bestFor: 'Loading per-project environment safely when entering a directory.',
    qualityNote: 'Keeps secrets and project setup out of random shell history and README rituals.',
  },
  {
    id: 'k6',
    name: 'k6',
    url: 'https://k6.io/open-source/',
    surface: 'cli',
    category: 'automation-ops',
    access: 'open-source',
    badges: ['load testing', 'JS scripts', 'performance'],
    bestFor: 'Testing whether an API or site survives real traffic.',
    qualityNote: 'Open-source load testing that gives solo builders feedback before users do.',
  },
  {
    id: 'rclone',
    name: 'rclone',
    url: 'https://rclone.org/',
    surface: 'cli',
    category: 'automation-ops',
    access: 'open-source',
    badges: ['sync', 'backups', 'cloud storage'],
    bestFor: 'Backups and file sync across many storage providers.',
    qualityNote: 'Turns cheap/free storage accounts into scriptable backup infrastructure.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CLI — BACKEND & INFRASTRUCTURE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'podman',
    name: 'Podman',
    url: 'https://podman.io/',
    surface: 'cli',
    category: 'backend-infra',
    access: 'open-source',
    badges: ['containers', 'rootless', 'Docker alternative'],
    bestFor: 'Running containers locally without Docker Desktop lock-in.',
    qualityNote:
      'Rootless containers and open tooling make it a strong choice for low-budget dev environments.',
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    url: 'https://www.sqlite.org/',
    surface: 'cli',
    category: 'backend-infra',
    access: 'open-source',
    badges: ['database', 'embedded', 'zero server'],
    bestFor: 'Local apps, prototypes, scripts, small services, and data analysis.',
    qualityNote: 'The most underrated zero-cost database: no server, no account, no bill.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CLI — SECURITY & PRIVACY
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'trivy',
    name: 'Trivy',
    url: 'https://trivy.dev/',
    surface: 'cli',
    category: 'security-privacy',
    access: 'open-source',
    badges: ['security scan', 'containers', 'deps'],
    bestFor: 'Scanning containers, dependencies, IaC, secrets, and repo risk.',
    qualityNote: 'One of the easiest high-value security tools to add to a poor developer stack.',
  },
  {
    id: 'gitleaks',
    name: 'Gitleaks',
    url: 'https://github.com/gitleaks/gitleaks',
    surface: 'cli',
    category: 'security-privacy',
    access: 'open-source',
    badges: ['secret scanning', 'Git', 'CI'],
    bestFor: 'Catching leaked API keys before they become a bill or breach.',
    qualityNote:
      'A must-have for anyone using free credits or API keys they cannot afford to leak.',
  },
  {
    id: 'age',
    name: 'age',
    url: 'https://github.com/FiloSottile/age',
    surface: 'cli',
    category: 'security-privacy',
    access: 'open-source',
    badges: ['encryption', 'files', 'simple'],
    bestFor: 'Encrypting files with a modern, understandable command-line tool.',
    qualityNote: 'Much easier to use correctly than older encryption workflows.',
  },
  {
    id: 'syncthing',
    name: 'Syncthing',
    url: 'https://syncthing.net/',
    surface: 'cli',
    category: 'security-privacy',
    access: 'open-source',
    badges: ['sync', 'private', 'peer-to-peer'],
    bestFor: 'Private file sync between your own devices without a central cloud account.',
    qualityNote: 'Excellent for people who need ownership and cannot pay for more cloud storage.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CLI — PRODUCTIVITY
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'fzf',
    name: 'fzf',
    url: 'https://github.com/junegunn/fzf',
    surface: 'cli',
    category: 'productivity',
    access: 'open-source',
    badges: ['fuzzy finder', 'terminal', 'workflow'],
    bestFor: 'Interactive picking: files, history, branches, processes, anything piped.',
    qualityNote: 'A tiny tool that changes the feel of the whole terminal.',
  },
  {
    id: 'bat',
    name: 'bat',
    url: 'https://github.com/sharkdp/bat',
    surface: 'cli',
    category: 'productivity',
    access: 'open-source',
    badges: ['cat alternative', 'syntax highlight', 'Git'],
    bestFor: 'Reading files with syntax highlighting and useful defaults.',
    qualityNote: 'Tiny quality-of-life upgrade that makes terminal reading less punishing.',
  },
  {
    id: 'eza',
    name: 'eza',
    url: 'https://github.com/eza-community/eza',
    surface: 'cli',
    category: 'productivity',
    access: 'open-source',
    badges: ['ls alternative', 'Git status', 'icons'],
    bestFor: 'Seeing directory structure and metadata more clearly than plain ls.',
    qualityNote: 'Useful on messy projects where visibility prevents mistakes.',
  },
  {
    id: 'zoxide',
    name: 'zoxide',
    url: 'https://github.com/ajeetdsouza/zoxide',
    surface: 'cli',
    category: 'productivity',
    access: 'open-source',
    badges: ['jump', 'terminal', 'speed'],
    bestFor: 'Jumping to frequent directories without typing long paths.',
    qualityNote: 'Small tool, huge daily payoff.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // ADDITIONAL VERIFIED FREE TOOLS (batch 1 — inference, notebooks, APIs)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'huggingface-inference-api',
    name: 'Hugging Face Inference API',
    url: 'https://huggingface.co/inference-api',
    surface: 'api',
    category: 'ai-assistants',
    access: 'public-api',
    badges: ['many models', 'no key', 'serverless'],
    bestFor: 'Running 200,000+ models via API without managing infrastructure.',
    qualityNote: 'Generous free tier with thousands of open models ready to call.',
  },
  {
    id: 'glhf-gg',
    name: 'GLHF.gg',
    url: 'https://glhf.gg/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['free GPU', 'LLMs', 'chat'],
    bestFor: 'Running larger LLMs on free GPU compute without a powerful home machine.',
    qualityNote: 'Offers free GPU hours for running open models in the browser.',
  },
  {
    id: 'together-ai',
    name: 'Together AI',
    url: 'https://together.ai/',
    surface: 'api',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['free credits', 'open models', 'API'],
    bestFor: 'Free API access to Llama, Mixtral, and other open models.',
    qualityNote: 'Free starter credits; popular for hobbyist AI app backends.',
  },
  {
    id: 'cerebras-inference',
    name: 'Cerebras Inference',
    url: 'https://cloud.cerebras.ai/',
    surface: 'api',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['ultra-fast', 'Llama', 'free tier'],
    bestFor: 'Blazingly fast LLM inference with free cloud access.',
    qualityNote: 'Custom hardware offers one of the fastest free inference tiers.',
  },
  {
    id: 'fal-ai',
    name: 'fal.ai',
    url: 'https://fal.ai/',
    surface: 'api',
    category: 'ai-image',
    access: 'free-tier',
    badges: ['image gen API', 'fast', 'free credits'],
    bestFor: 'Programmatic image generation and editing via fast API.',
    qualityNote: 'Free credits available; popular for production prototyping.',
  },
  {
    id: 'replicate',
    name: 'Replicate',
    url: 'https://replicate.com/',
    surface: 'api',
    category: 'ai-image',
    access: 'free-tier',
    badges: ['open models', 'API', 'free credits'],
    bestFor: 'Running 1000+ open AI models via simple API call.',
    qualityNote: 'Huge model library with generous free tier for experimentation.',
  },
  {
    id: 'banana-dev',
    name: 'Banana.dev',
    url: 'https://app.banana.dev/',
    surface: 'api',
    category: 'coding-devtools',
    access: 'free-tier',
    badges: ['serverless GPU', 'inference', 'Python'],
    bestFor: 'Running ML models on serverless GPU without managing infrastructure.',
    qualityNote: 'Free tier includes CPU minutes and some GPU access.',
  },
  {
    id: 'google-colab',
    name: 'Google Colab Free',
    url: 'https://colab.research.google.com/',
    surface: 'web',
    category: 'coding-devtools',
    access: 'free-tier',
    badges: ['GPU', 'notebooks', 'Python'],
    bestFor: 'Running Python, ML, and data science in a free cloud notebook with GPU.',
    qualityNote: 'Free GPU access is the killer feature for students and hobbyists.',
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    url: 'https://www.kaggle.com/',
    surface: 'web',
    category: 'ai-math',
    access: 'free-tier',
    badges: ['datasets', 'GPU notebooks', 'competitions'],
    bestFor: 'Learning ML, finding datasets, and competing for free with GPU notebooks.',
    qualityNote: 'Free GPU notebooks and 100,000+ public datasets.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // ADDITIONAL TOOLS (batch 2 — more AI assistants & utilities)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'koboldcpp',
    name: 'KoboldCpp',
    url: 'https://github.com/LostRuins/koboldcpp',
    surface: 'cli',
    category: 'ai-assistants',
    access: 'open-source',
    badges: ['local LLM', 'GGUF', 'CPU/GPU'],
    bestFor: 'Running GGUF LLMs locally with a simple UI on any machine.',
    qualityNote: 'Lightweight, works on CPU; great for low-resource hardware.',
  },
  {
    id: 'lm-studio',
    name: 'LM Studio',
    url: 'https://lmstudio.ai/',
    surface: 'cli',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['local LLM', 'desktop app', 'GGUF'],
    bestFor: 'Discovering, downloading, and running local LLMs with a clean GUI.',
    qualityNote: 'Excellent for non-technical users wanting private AI chat.',
  },
  {
    id: 'jan-ai',
    name: 'Jan',
    url: 'https://jan.ai/',
    surface: 'cli',
    category: 'ai-assistants',
    access: 'open-source',
    badges: ['local LLM', 'desktop', 'privacy'],
    bestFor: 'Open-source desktop app for running local LLMs privately.',
    qualityNote: 'Actively developed, clean UX, works offline with downloaded models.',
  },
  {
    id: 'open-webui',
    name: 'Open WebUI',
    url: 'https://github.com/open-webui/open-webui',
    surface: 'web',
    category: 'ai-assistants',
    access: 'open-source',
    badges: ['LLM interface', 'self-host', 'RAG'],
    bestFor: 'Self-hosted web UI for LLMs with RAG, multi-model, and file support.',
    qualityNote: 'Formerly Ollama WebUI; now a full-featured open-source AI chat platform.',
  },
  {
    id: 'text-generation-webui',
    name: 'Text Generation WebUI',
    url: 'https://github.com/oobabooga/text-generation-webui',
    surface: 'web',
    category: 'ai-assistants',
    access: 'open-source',
    badges: ['local LLM', 'extensions', 'multi-model'],
    bestFor: 'Advanced local LLM hosting with extensions, character cards, and APIs.',
    qualityNote: 'The most flexible open-source local LLM interface; steep learning curve.',
  },
  {
    id: 'llama-cpp-python',
    name: 'llama-cpp-python',
    url: 'https://github.com/abetlen/llama-cpp-python',
    surface: 'cli',
    category: 'coding-devtools',
    access: 'open-source',
    badges: ['Python', 'GGUF', 'bindings'],
    bestFor: 'Python bindings for llama.cpp for running LLMs in scripts and apps.',
    qualityNote: 'Makes local LLM integration accessible from Python code.',
  },
  {
    id: 'cogr',
    name: 'Cogr',
    url: 'https://cogr.ai/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'no-login',
    badges: ['AI chat', 'no signup', 'simple'],
    bestFor: 'Quick anonymous AI chat without any account.',
    qualityNote: 'Minimal friction; useful as a throwaway chat tool.',
  },
  {
    id: 'fahai',
    name: 'FaH AI',
    url: 'https://fahai.org/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'no-login',
    badges: ['free chat', 'no account', 'simple'],
    bestFor: 'Quick anonymous AI chat without registration.',
    qualityNote: 'Very low friction; useful as a throwaway chat tool.',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek Chat',
    url: 'https://chat.deepseek.com/',
    surface: 'web',
    category: 'ai-assistants',
    access: 'free-tier',
    badges: ['powerful', 'coding', 'reasoning'],
    bestFor: 'Strong AI chat for coding, reasoning, and analytical tasks.',
    qualityNote: 'DeepSeek-V3/R1 models are excellent for technical questions.',
  },
  {
    id: 'gpt4all',
    name: 'GPT4All',
    url: 'https://gpt4all.io/',
    surface: 'cli',
    category: 'ai-assistants',
    access: 'open-source',
    badges: ['local LLM', 'desktop app', 'offline'],
    bestFor: 'Running a private local AI assistant on any computer without internet.',
    qualityNote: 'One of the most mature local LLM desktop apps with a large model hub.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // ADDITIONAL TOOLS (batch 3 — image, design, media)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'stablediffusion-webui',
    name: 'Stable Diffusion WebUI (AUTOMATIC1111)',
    url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
    surface: 'web',
    category: 'ai-image',
    access: 'open-source',
    badges: ['image gen', 'local', 'OSS'],
    bestFor: 'Running Stable Diffusion locally with full control over generation.',
    qualityNote: 'The most popular open-source UI for Stable Diffusion with thousands of extensions.',
  },
  {
    id: 'stablediffusion-comfyui',
    name: 'ComfyUI',
    url: 'https://github.com/comfyanonymous/ComfyUI',
    surface: 'web',
    category: 'ai-image',
    access: 'open-source',
    badges: ['image gen', 'node-based', 'local'],
    bestFor: 'Visual node-based interface for building complex Stable Diffusion workflows.',
    qualityNote: 'Ultimate flexibility for advanced users; has a learning curve.',
  },
  {
    id: 'fooocus',
    name: 'Fooocus',
    url: 'https://github.com/lllyasviel/Fooocus',
    surface: 'web',
    category: 'ai-image',
    access: 'open-source',
    badges: ['image gen', 'simple', 'Stable Diffusion'],
    bestFor: 'Simple Stable Diffusion GUI with automatic prompt enhancement.',
    qualityNote: 'One-click image generation like Midjourney but open-source.',
  },
  {
    id: 'midjourney-free',
    name: 'Midjourney Free Trial',
    url: 'https://www.midjourney.com/',
    surface: 'web',
    category: 'ai-image',
    access: 'free-tier',
    badges: ['high quality', 'artistic', 'popular'],
    bestFor: 'High-quality artistic AI image generation (free trial available).',
    qualityNote: 'Industry-leading aesthetic quality; free trial has limited generations.',
  },
  {
    id: 'dall-e-free',
    name: 'DALL-E Free (via Bing)',
    url: 'https://www.bing.com/images/create',
    surface: 'web',
    category: 'ai-image',
    access: 'free-tier',
    badges: ['DALL-E', 'Microsoft', 'free'],
    bestFor: 'Free DALL-E image generation via Microsoft Copilot/Bing.',
    qualityNote: 'Access to DALL-E 3 quality without paying for ChatGPT Plus.',
  },
  {
    id: 'kaiber-free',
    name: 'Kaiber',
    url: 'https://kaiber.ai/',
    surface: 'web',
    category: 'ai-video',
    access: 'free-tier',
    badges: ['video gen', 'animation', 'free tier'],
    bestFor: 'AI video generation with style transfer and animation.',
    qualityNote: 'Free tier includes daily credits for short video generation.',
  },
  {
    id: 'runway-free',
    name: 'RunwayML Free',
    url: 'https://runwayml.com/',
    surface: 'web',
    category: 'ai-video',
    access: 'free-tier',
    badges: ['video editing', 'AI', 'free tier'],
    bestFor: 'AI-powered video editing, green screen, and generation.',
    qualityNote: 'Industry-standard video AI tools with free trial credits.',
  },
  {
    id: 'pika-free',
    name: 'Pika Labs Free',
    url: 'https://pika.art/',
    surface: 'web',
    category: 'ai-video',
    access: 'free-tier',
    badges: ['video gen', 'Discord', 'free tier'],
    bestFor: 'Free AI video generation via Discord or web interface.',
    qualityNote: 'Popular for generating short animated clips from text prompts.',
  },
  {
    id: 'moises-free',
    name: 'Moises Free',
    url: 'https://moises.ai/',
    surface: 'web',
    category: 'ai-audio',
    access: 'free-tier',
    badges: ['stem separation', 'music', 'free tier'],
    bestFor: 'Separating vocals and instruments from music tracks.',
    qualityNote: 'Free tier includes basic stem separation and pitch shifting.',
  },
  {
    id: 'whisper-web',
    name: 'Whisper Web',
    url: 'https://huggingface.co/spaces/Xenova/whisper-web',
    surface: 'web',
    category: 'ai-audio',
    access: 'no-login',
    badges: ['transcription', 'offline', 'no signup'],
    bestFor: 'Free speech-to-text transcription running in the browser.',
    qualityNote: 'OpenAI Whisper running client-side via WebAssembly.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // ADDITIONAL TOOLS (batch 4 — writing, docs, productivity)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'paperpal',
    name: 'Paperpal',
    url: 'https://paperpal.com/',
    surface: 'web',
    category: 'ai-writing',
    access: 'free-tier',
    badges: ['academic writing', 'grammar', 'free tier'],
    bestFor: 'Real-time AI writing and grammar for academic and scientific writing.',
    qualityNote: 'Specifically trained on academic writing patterns.',
  },
  {
    id: 'writefull',
    name: 'Writefull',
    url: 'https://writefull.com/',
    surface: 'web',
    category: 'ai-writing',
    access: 'free-tier',
    badges: ['academic', 'LaTeX', 'grammar'],
    bestFor: 'AI language feedback for academic writing with LaTeX support.',
    qualityNote: 'Designed specifically for researchers and academics.',
  },
  {
    id: 'notion-ai-free',
    name: 'Notion AI Free Trial',
    url: 'https://www.notion.so/',
    surface: 'web',
    category: 'productivity',
    access: 'free-tier',
    badges: ['workspace', 'AI assistant', 'notes'],
    bestFor: 'All-in-one workspace with AI writing and organization.',
    qualityNote: 'Free tier includes basic AI features; full AI requires add-on.',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    url: 'https://obsidian.md/',
    surface: 'cli',
    category: 'productivity',
    access: 'free-tier',
    badges: ['notes', 'local', 'graph view'],
    bestFor: 'Local-first personal knowledge base with linking and graph view.',
    qualityNote: 'Free for personal use; excellent for building a second brain.',
  },
  {
    id: 'logseq',
    name: 'Logseq',
    url: 'https://logseq.com/',
    surface: 'web',
    category: 'productivity',
    access: 'open-source',
    badges: ['notes', 'outliner', 'local-first'],
    bestFor: 'Outliner-based local-first knowledge management.',
    qualityNote: 'Open-source alternative to Roam Research and Obsidian.',
  },
  {
    id: 'vercel-free',
    name: 'Vercel Free',
    url: 'https://vercel.com/',
    surface: 'web',
    category: 'backend-infra',
    access: 'free-tier',
    badges: ['Jamstack', 'serverless', 'edge'],
    bestFor: 'Free frontend deployment with serverless functions.',
    qualityNote: 'Industry standard for Next.js and static sites.',
  },
  {
    id: 'deno-deploy-free',
    name: 'Deno Deploy Free',
    url: 'https://deno.com/deploy',
    surface: 'web',
    category: 'backend-infra',
    access: 'free-tier',
    badges: ['serverless', 'TypeScript', 'edge'],
    bestFor: 'Running TypeScript/JavaScript on the edge for free.',
    qualityNote: 'Free tier includes 100,000 requests per day.',
  },
];

export function getToolsByCategory(): Record<ZeroKeyCategory, ZeroKeyTool[]> {
  const grouped = {} as Record<ZeroKeyCategory, ZeroKeyTool[]>;
  for (const tool of zeroKeyTools) {
    grouped[tool.category] ??= [];
    grouped[tool.category].push(tool);
  }
  return grouped;
}

export function getToolsBySurface(): Record<ZeroKeySurface, ZeroKeyTool[]> {
  const grouped: Record<ZeroKeySurface, ZeroKeyTool[]> = {
    web: [],
    api: [],
    cli: [],
  };
  for (const tool of zeroKeyTools) {
    grouped[tool.surface].push(tool);
  }
  return grouped;
}
