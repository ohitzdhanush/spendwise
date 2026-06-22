package com.spendwise.web;

import com.spendwise.model.Expense;
import com.spendwise.repo.ExpenseRepository;
import com.spendwise.web.CurrentUserService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseRepository repo;
    private final CurrentUserService currentUserService;

    public ExpenseController(ExpenseRepository repo, CurrentUserService currentUserService) {
        this.repo = repo;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/ping")
    public String ping() {
        return "OK";
    }

    @GetMapping
    public List<Expense> getAll(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Long userId = currentUserService.requireUser(authorization).getId();
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @PostMapping
    public Expense add(
        @RequestHeader(value = "Authorization", required = false) String authorization,
        @RequestBody Expense expense
    ) {
        expense.setUserId(currentUserService.requireUser(authorization).getId());
        return repo.save(expense);
    }

    @PutMapping("/{id}")
    public Expense update(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false) String authorization,
        @RequestBody Expense updated
    ) {
        Long userId = currentUserService.requireUser(authorization).getId();
        Expense exp = findExpense(id, userId);

        exp.setAmount(updated.getAmount());
        exp.setCategory(updated.getCategory());
        if (updated.getCreatedAt() != null) {
            exp.setCreatedAt(updated.getCreatedAt());
        }

        return repo.save(exp);
    }

    @DeleteMapping("/{id}")
    public void delete(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        Long userId = currentUserService.requireUser(authorization).getId();
        repo.delete(findExpense(id, userId));
    }

    private Expense findExpense(Long id, Long userId) {
        return repo.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
