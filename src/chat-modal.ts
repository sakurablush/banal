/**
 * Chat Modal Module — renders chat UI in a modal dialog.
 * 
 * This module handles opening/closing the chat modal and renders the chat UI
 * inside the modal container. All chat functionality (quick starts, prompt templates,
 * export, keys modal) is preserved from the original chat.ts implementation.
 */

import { initChat } from './chat';

let isInitialized = false;
let cleanupFunctions: Array<() => void> = [];

/**
 * Initialize the chat modal functionality.
 * Sets up event listeners for opening/closing the modal.
 */
export function initChatModal(): void {
  // Cleanup any previous initialization
  cleanup();

  const openBtn = document.getElementById('open-chat-modal');
  const openBtnMobile = document.getElementById('open-chat-modal-mobile');
  const closeBtn = document.getElementById('close-chat-modal');
  const modal = document.getElementById('chat-modal');
  const content = document.getElementById('chat-modal-content');

  if (!modal || !content) {
    console.warn('Chat modal elements not found');
    return;
  }

  // Open modal handlers
  const openModal = () => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    
    // Initialize chat UI if not already done
    if (!isInitialized) {
      renderChatUI(content);
      isInitialized = true;
    }
  };

  // Close modal handlers
  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore background scroll
  };

  // Close on backdrop click
  const handleBackdropClick = (e: Event) => {
    if (e.target === modal) {
      closeModal();
    }
  };

  // Close on Escape key
  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  };

  // Attach event listeners
  openBtn?.addEventListener('click', openModal);
  openBtnMobile?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', handleBackdropClick);
  document.addEventListener('keydown', handleEscapeKey);

  // Store cleanup functions
  cleanupFunctions = [
    () => openBtn?.removeEventListener('click', openModal),
    () => openBtnMobile?.removeEventListener('click', openModal),
    () => closeBtn?.removeEventListener('click', closeModal),
    () => modal.removeEventListener('click', handleBackdropClick),
    () => document.removeEventListener('keydown', handleEscapeKey),
  ];
}

/**
 * Cleanup function to remove event listeners and reset state.
 * Call this when the component unmounts or needs to be reinitialized.
 */
export function cleanup(): void {
  cleanupFunctions.forEach(fn => fn());
  cleanupFunctions = [];
  isInitialized = false;
}

/**
 * Render the chat UI inside the modal container.
 * This reuses the existing chat.ts initialization logic.
 */
function renderChatUI(container: HTMLElement): void {
  // Create a wrapper div that mimics the original section structure
  const wrapper = document.createElement('div');
  wrapper.id = 'chat-modal-wrapper';
  wrapper.className = 'h-full flex flex-col';
  
  // Create the chat root container that chat.ts expects
  const chatRoot = document.createElement('div');
  chatRoot.id = 'experience';
  chatRoot.className = 'flex-1 overflow-hidden';
  
  wrapper.appendChild(chatRoot);
  container.appendChild(wrapper);
  
  // Initialize chat - this will render into the #experience container
  try {
    initChat();
  } catch (error) {
    console.error('Failed to initialize chat in modal:', error);
    container.innerHTML = `
      <div class="flex items-center justify-center h-full text-white/60">
        <div class="text-center">
          <p class="text-lg mb-2">⚠️ Unable to load chat</p>
          <p class="text-sm">Please refresh the page and try again.</p>
        </div>
      </div>
    `;
  }
}
