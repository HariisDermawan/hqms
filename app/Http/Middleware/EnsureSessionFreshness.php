<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureSessionFreshness
{
    /**
     * The session key that stores the login timestamp.
     */
    public const LOGINED_AT_KEY = 'logined_at';

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check()) {
            return $next($request);
        }

        $lifetime = (int) config('session.lifetime');

        $loginedAt = $request->session()->get(self::LOGINED_AT_KEY);

        if ($loginedAt === null || (now()->timestamp - (int) $loginedAt) >= $lifetime * 60) {
            $this->forgetSession($request);

            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session expired. Please log in again.',
                    'data' => null,
                ], 401);
            }

            return redirect()->route('login')
                ->with('error', 'Sesi anda sudah berakhir. Silakan login kembali.');
        }

        return $next($request);
    }

    private function forgetSession(Request $request): void
    {
        $guard = Auth::guard();

        $guard->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();
    }
}