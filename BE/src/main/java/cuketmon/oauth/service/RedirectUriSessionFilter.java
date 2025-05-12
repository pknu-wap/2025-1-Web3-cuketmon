package cuketmon.oauth.service;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RedirectUriSessionFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String redirectUri = request.getParameter("redirect_uri");

        if (redirectUri != null) {
            request.getSession().setAttribute("redirect_uri", redirectUri);
        }

        filterChain.doFilter(request, response);
    }

}