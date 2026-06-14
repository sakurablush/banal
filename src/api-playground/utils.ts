/**
 * Small, pure helpers used by the API Playground UI and tests.
 */

import type { PlaygroundCategory, WeatherCoordinates, WeatherSummary } from './types';

const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const PLAYGROUND_CATEGORY_LABELS: Record<PlaygroundCategory, string> = {
  chat: 'Chat',
  data: 'Data',
  image: 'Image',
  utility: 'Utility',
};

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPE[char]);
}

export function maskKey(key: string): string {
  const trimmed = key.trim();
  if (trimmed.length <= 8) {
    return `${trimmed.slice(0, 2)}••••${trimmed.slice(-2)}`;
  }
  return `${trimmed.slice(0, 4)}••••••${trimmed.slice(-4)}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function formatMs(ms: number): string {
  return `${Math.max(0, Math.round(ms))} ms`;
}

export function parseCoordinates(input: string): WeatherCoordinates | null {
  const match = input.trim().match(/^(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;

  return {
    latitude: String(latitude),
    longitude: String(longitude),
  };
}

export function weatherCodeLabel(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Fog';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow grains';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Weather';
}

export function buildWeatherText(summary?: WeatherSummary): string {
  if (!summary) return 'No weather summary available.';
  const location = summary.location ? `${summary.location} — ` : '';
  const current = summary.current
    ? `${location}${weatherCodeLabel(summary.current.weatherCode)}, ${summary.current.temperature}°C, wind ${summary.current.windSpeed} km/h at ${summary.current.time}`
    : `${location}Open-Meteo forecast`;
  const daily = summary.daily?.slice(0, 3).map((day) => {
    const high = day.temperatureMax;
    const low = day.temperatureMin;
    const rain = day.precipitationSum;
    return `${day.date}: ${high}/${low}°C, ${rain} mm`;
  });
  return daily?.length
    ? `${current}. Next days: ${daily.join('; ')}. ${summary.attribution}`
    : `${current}. ${summary.attribution}`;
}

export function renderMarkdown(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

export function renderWeatherHtml(summary?: WeatherSummary): string {
  if (!summary) {
    return '<div class="pg-empty">No weather summary available.</div>';
  }

  const current = summary.current
    ? `
      <div class="pg-weather-current">
        <div class="pg-weather-temp">${summary.current.temperature}°C</div>
        <div>${escapeHtml(weatherCodeLabel(summary.current.weatherCode))}</div>
        <div class="pg-weather-muted">Wind ${summary.current.windSpeed} km/h · ${escapeHtml(summary.current.time)}</div>
      </div>
    `
    : '';

  const daily = summary.daily
    ?.map(
      (day) => `
        <tr>
          <td>${escapeHtml(day.date)}</td>
          <td>${day.temperatureMax}/${day.temperatureMin}°C</td>
          <td>${day.precipitationSum} mm</td>
          <td>${escapeHtml(weatherCodeLabel(day.weatherCode))}</td>
        </tr>
      `
    )
    .join('');

  const hourly = summary.hourly
    ?.slice(0, 6)
    .map(
      (hour) => `
        <div class="pg-hour-card">
          <strong>${escapeHtml(hour.time)}</strong>
          <span>${hour.temperature}°C</span>
          <span>${hour.precipitationProbability}% rain</span>
        </div>
      `
    )
    .join('');

  return `
    <div class="pg-weather">
      ${current}
      ${hourly ? `<div class="pg-hour-list">${hourly}</div>` : ''}
      ${daily ? `<table class="pg-weather-table"><thead><tr><th>Day</th><th>High/Low</th><th>Rain</th><th>Condition</th></tr></thead><tbody>${daily}</tbody></table>` : ''}
      <p class="pg-attribution">${escapeHtml(summary.attribution)}</p>
    </div>
  `;
}

export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy clipboard path for browsers that block the async API.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}
